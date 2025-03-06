const Bid = require('../models/Bid.model');
const Auction = require('../models/Auction.model');
const HttpStatus = require('http-status-codes');
const createError = require('http-errors');

module.exports.createBid = (req, res, next) => {
    Bid.create(req.body)
        .then(bid => {
            // Actualizar la subasta asociada agregando el ID de la puja al array de bids
            return Auction.findByIdAndUpdate(
                bid.auction,
                { $push: { bids: bid._id } }, // Agrega el ID de la puja al array de bids
                { new: true }
            ).then(auction => {
                if (!auction) {
                    throw createError(HttpStatus.StatusCodes.NOT_FOUND, 'Subasta no encontrada');
                }
                res.status(HttpStatus.StatusCodes.CREATED).json(bid);
            });
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
module.exports.getBidForAuctionAndCompany = (req, res, next) => {
    const { auction, company } = req.query;
    console.log('entraaaaaa'); // Esto se imprimirá ahora si se hace el request a la ruta correcta

    if (!auction || !company) {
        return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'Se requieren auctionId y companyId' });
    }

    Bid.findOne({ auction, company })
        .populate('client', 'name email') // Asegúrate de usar el nombre correcto del campo (en minúscula)
        .populate('company', 'name cif')
        .populate('auction', 'durationDays createdAt')
        .lean()
        .exec()
        .then(bid => {
            console.log(bid);
            if (!bid) {
                return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'No hay puja para esta compañía en esta subasta' });
            }
            res.status(HttpStatus.StatusCodes.OK).json(bid);
        })
        .catch(next);
};