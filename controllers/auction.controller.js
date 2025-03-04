const Auction = require('../models/Auction.model');
const Project = require('../models/Project.model');
const HttpStatus = require('http-status-codes');
const createError = require('http-errors');

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