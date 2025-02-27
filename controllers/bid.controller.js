const Bid = require('../models/Bid.model');
const HttpStatus = require('http-status-codes');
const createError = require('http-errors');

module.exports.createBid = (req, res, next) => {
    Bid.create(req.body)
        .then(bid => {
            res.status(HttpStatus.StatusCodes.CREATED).json(bid);
        })
        .catch(next);
};

module.exports.getBids = (req, res, next) => {
    Bid.find()
        .then(bids => {
            res.status(HttpStatus.StatusCodes.OK).json(bids);
        })
        .catch(next);
};

module.exports.getBid = (req, res, next) => {
    const { id } = req.params;
    Bid.findById(id)
        .then(bid => {
            if (!bid) return res.status(HttpStatus.StatusCodes.NOT_FOUND).send();
            res.status(HttpStatus.StatusCodes.OK).json(bid);
        })
        .catch(next);
};

module.exports.editBid = (req, res, next) => {
    const { id } = req.params
    Bid.findByIdAndUpdate(id, req.body, { new: true })
        .then((bid) => {
            if (!bid) return res.status(HttpStatus.StatusCodes.NOT_FOUND).send();
            res.status(HttpStatus.StatusCodes.Ok).json(bid)
        })
        .catch(() => next(createError(HttpStatus.StatusCodes.CONFLICT, 'Error updating bid')));
}