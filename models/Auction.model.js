const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuctionSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Se requiere asociar un proyecto a la subasta']
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    durationDays: {
        type: Number,
        required: [true, 'Se requiere la duración de la subasta en días']
    },
    closed: {
        type: Boolean,
        default: false
    },
    bids: [{
        type: Schema.Types.ObjectId,
        ref: 'Bid'
    }],
    resultsNotified: {
        type: Boolean,
        default: false
    },
    // Campos para la ronda de desempate
    isTieBreak: {
        type: Boolean,
        default: false
    },
    parentAuction: {
        type: Schema.Types.ObjectId,
        ref: 'Auction',
        default: null
    },
    eligibleClients: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Auction', AuctionSchema);