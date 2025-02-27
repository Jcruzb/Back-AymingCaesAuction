const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BidSchema = new Schema({
    auction: {
        type: Schema.Types.ObjectId,
        ref: 'Auction',
        required: [true, 'Se requiere asociar la oferta a una subasta']
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Se requiere asociar la oferta a un cliente']
    },
    bidPrice: {
        type: Number,
        required: [true, 'Se requiere un precio para la oferta']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Bid', BidSchema);