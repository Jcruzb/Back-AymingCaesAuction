const Auction = require('../models/Auction.model');
const Project = require('../models/Project.model');
const User = require('../models/User.model')
const Bid = require('../models/Bid.model')
const HttpStatus = require('http-status-codes');
const createError = require('http-errors');
const {
  sendAuctionNotificationEmail,
  sendAuctionClosedNotificationEmail,
  sendAuctionResultWinnerEmail,
  sendAuctionResultTieEmail,
  sendAuctionResultNonWinnerEmail
} = require('../config/nodemailer.config');

module.exports.createAuction = (req, res, next) => {
  const {
    project,
    durationDays,
    minBid, // Valor de puja mínima
    minBidIncrement = 0.5,
    notificationConfig = { dailyNotification: true, finalDayNotification: { active: true, frequencyHours: 1 } }
  } = req.body;

  // Validaciones manuales
  if (notificationConfig.finalDayNotification?.active && notificationConfig.finalDayNotification?.frequencyHours < 1) {
    return next(createError(HttpStatus.StatusCodes.BAD_REQUEST, 'La frecuencia de notificación del último día debe ser de al menos 1 hora.'));
  }

  Auction.create({
    project,
    durationDays,
    minBid,
    minBidIncrement,
    notificationConfig
  })
    .then(auction => {
      return Project.findByIdAndUpdate(
        project,
        { $push: { auction: auction._id } },
        { new: true }
      ).then(updatedProject => {
        if (!updatedProject) {
          throw createError(HttpStatus.StatusCodes.NOT_FOUND, 'Proyecto no encontrado');
        }
        res.status(HttpStatus.StatusCodes.CREATED).json(auction);
      });
    })
    .catch(next);
};



module.exports.getAuctions = (req, res, next) => {
  Auction.find()
    .populate({
      path: 'project',
      select: 'title savingsGenerated durationDays createdAt closed',
    })
    .then(auctions => {
      res.status(HttpStatus.StatusCodes.OK).json(auctions);
    })
    .catch(next);
};

module.exports.getAuction = (req, res, next) => {
  const { id } = req.params;
  Auction.findById(id)
    .then(auction => {
      if (!auction) return res.status(HttpStatus.StatusCodes.NOT_FOUND).send();
      res.status(HttpStatus.StatusCodes.OK).json(auction);
    })
    .catch(next);
};

module.exports.updateAuction = (req, res, next) => {
  const { id } = req.params;
  Auction.findByIdAndUpdate(id, req.body, { new: true })
    .then(auction => {
      if (!auction) return res.status(HttpStatus.StatusCodes.NOT_FOUND).send();
      res.status(HttpStatus.StatusCodes.OK).json(auction);
    })
    .catch(() => next(createError(HttpStatus.StatusCodes.CONFLICT, 'Error updating auction')));
};

module.exports.getAuctionDetail = (req, res, next) => {
  const { id } = req.params; // ID de la subasta
  const user = req.currentUser; // Usuario autenticado

  console.log(user);

  if (user.role === 'administrador') {
    // ADMINISTRADOR VE TODAS LAS PUJAS con datos completos
    Auction.findById(id)
      .populate({
        path: 'project',
        select: 'title savingsGenerated durationDays createdAt closed'
      })
      .populate({
        path: 'bids',
        populate: [
          { path: 'client', select: 'name email' },
          { path: 'company', select: 'name cif' }
        ]
      })
      .lean()
      .exec()
      .then(auction => {
        if (!auction) {
          return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'Subasta no encontrada' });
        }
        res.status(HttpStatus.StatusCodes.OK).json(auction);
      })
      .catch(next);
  } else {
    // USUARIO SOLO VE SU PUJA
    Bid.findOne({ auction: id, company: user.company })
      .populate({
        path: 'auction',
        populate: {
          path: 'project',
          select: 'title savingsGenerated durationDays createdAt closed'
        }
      })
      .populate('client', 'name email')
      .populate('company', 'name cif')
      .lean()
      .exec()
      .then(bid => {
        if (!bid) {
          return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'No tienes una puja registrada en esta subasta' });
        }
        res.status(HttpStatus.StatusCodes.OK).json({
          auction: bid.auction,
          bids: [bid]
        });
      })
      .catch(next);
  }
};


module.exports.closeAuction = (req, res, next) => {
  const { id } = req.params;
  console.log('Cerrando subasta:', id);

  Auction.findById(id)
    .then(auction => {
      if (!auction) {
        throw createError(HttpStatus.StatusCodes.NOT_FOUND, 'Subasta no encontrada');
      }
      if (auction.closed) {
        throw createError(HttpStatus.StatusCodes.BAD_REQUEST, 'La subasta ya está cerrada');
      }
      return Auction.findByIdAndUpdate(id, { closed: true }, { new: true });
    })
    .then(updatedAuction => {
      return Project.findById(updatedAuction.project)
        .then(project => {
          if (!project) {
            throw createError(HttpStatus.StatusCodes.NOT_FOUND, 'Proyecto no encontrado');
          }
          // Obtener solo los usuarios con rol "usuario"
          return User.find({ role: 'usuario' }).then(users => {
            const emailPromises = users.map(user => {
              return sendAuctionClosedNotificationEmail(user, project);
            });
            return Promise.all(emailPromises).then(() => {
              res.status(HttpStatus.StatusCodes.OK).json({
                message: 'Subasta cerrada exitosamente, notificaciones enviadas',
                updatedAuction,
              });
            });
          });
        });
    })
    .catch(next);
};

module.exports.notifyResults = (req, res, next) => {
  const { id } = req.params; // ID de la subasta

  Auction.findById(id)
    .populate({
      path: 'bids',
      populate: [
        { path: 'client', select: 'name email' },
        { path: 'company', select: 'name cif' }
      ]
    })
    .populate({
      path: 'project',
      select: 'title savingsGenerated durationDays createdAt closed'
    })
    .lean()
    .exec()
    .then(auction => {
      if (!auction) {
        return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'Subasta no encontrada' });
      }

      const bids = auction.bids;
      if (!bids || bids.length === 0) {
        return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'No hay pujas para esta subasta' });
      }

      // Determinar el mayor precio de puja
      const maxBidPrice = Math.max(...bids.map(bid => bid.bidPrice));
      // Determinar los ganadores (podría ser empate)
      const winners = bids.filter(bid => bid.bidPrice === maxBidPrice);
      const tie = winners.length > 1;

      // Preparar las promesas para enviar correos según el resultado
      const emailPromises = bids.map(bid => {
        if (winners.find(winner => winner._id.toString() === bid._id.toString())) {
          // Es ganador
          if (tie) {
            return sendAuctionResultTieEmail(bid.client, auction.project, bid);
          } else {
            return sendAuctionResultWinnerEmail(bid.client, auction.project, bid);
          }
        } else {
          return sendAuctionResultNonWinnerEmail(bid.client, auction.project, bid);
        }
      });

      // Actualizar la subasta para marcar que se han notificado los resultados
      Auction.findByIdAndUpdate(id, { resultsNotified: true }, { new: true })
        .then(updatedAuction => {
          Promise.all(emailPromises)
            .then(() => {
              res.status(HttpStatus.StatusCodes.OK).json({ message: 'Resultados notificados', auction: updatedAuction });
            })
            .catch(err => {
              console.error("Error enviando emails de resultados:", err);
              res.status(HttpStatus.StatusCodes.OK).json({ message: 'Resultados notificados, pero hubo errores al enviar algunos emails', auction: updatedAuction });
            });
        });
    })
    .catch(next);
};

module.exports.launchAuction = (req, res, next) => {
  const { id } = req.params;
  // Actualizamos la subasta, estableciendo closed a false para "lanzarla"
  Auction.findByIdAndUpdate(id, { closed: false, launched: true }, { new: true })
    .then(auction => {
      if (!auction) {
        throw createError(HttpStatus.StatusCodes.NOT_FOUND, 'Subasta no encontrada');
      }
      // Obtenemos el proyecto asociado a la subasta
      return Project.findById(auction.project)
        .then(project => {
          if (!project) {
            throw createError(HttpStatus.StatusCodes.NOT_FOUND, 'Proyecto no encontrado');
          }
          // Obtenemos sólo los usuarios con rol "usuario" para notificar
          return User.find({ role: 'usuario' }).then(users => {
            const emailPromises = users.map(user => {
              return sendAuctionNotificationEmail(user, project);
            });
            return Promise.all(emailPromises).then(() => {
              res.status(HttpStatus.StatusCodes.OK).json({ message: 'Subasta lanzada y notificaciones enviadas', auction });
            });
          });
        });
    })
    .catch(next);
};