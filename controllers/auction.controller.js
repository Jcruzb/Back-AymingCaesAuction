const Auction = require('../models/Auction.model');
const Project = require('../models/Project.model');
const User = require('../models/User.model')
const HttpStatus = require('http-status-codes');
const createError = require('http-errors');
const { sendAuctionNotificationEmail } = require('../config/nodemailer.config');

module.exports.createAuction = (req, res, next) => {
    Auction.create(req.body)
      .then(auction => {
        // Se asume que req.body.project contiene el id del proyecto
        return Project.findByIdAndUpdate(
          auction.project,
          { $push: { auction: auction._id } },
          { new: true }
        )
        .then(updatedProject => {
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

module.exports.closeAuction = (req, res, next) => {
    const { id } = req.params;
    Auction.findByIdAndUpdate(id, { closed: true }, { new: true })
        .then(auction => {
            if (!auction) return res.status(HttpStatus.StatusCodes.NOT_FOUND).send();
            res.status(HttpStatus.StatusCodes.OK).json({ message: 'Auction closed successfully', auction });
        })
        .catch(() => next(createError(HttpStatus.StatusCodes.CONFLICT, 'Error closing auction')));
};

module.exports.notifyResults = (req, res, next) => {
    const { id } = req.params;
    Auction.findByIdAndUpdate(id, { resultsNotified: true }, { new: true })
        .then(auction => {
            if (!auction) return res.status(HttpStatus.StatusCodes.NOT_FOUND).send();
            res.status(HttpStatus.StatusCodes.OK).json({ message: 'Results notified successfully', auction });
        })
        .catch(() => next(createError(HttpStatus.StatusCodes.CONFLICT, 'Error notifying results')));
};

module.exports.launchAuction = (req, res, next) => {
    const { id } = req.params;
    // Actualizamos la subasta, estableciendo closed a false para "lanzarla"
    Auction.findByIdAndUpdate(id, { closed: false }, { new: true })
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