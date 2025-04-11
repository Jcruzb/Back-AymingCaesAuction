const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuctionSchema = new Schema({
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    startDate: { type: Date, default: Date.now },
    durationDays: { type: Number, required: [true, 'Se requiere la duración de la subasta en días'] },
    launched: { type: Boolean, default: false },
    closed: { type: Boolean, default: false },
    bids: [{ type: Schema.Types.ObjectId, ref: 'Bid' }],
    resultsNotified: { type: Boolean, default: false },
    isTieBreak: { type: Boolean, default: false },
    parentAuction: { type: Schema.Types.ObjectId, ref: 'Auction', default: null },
    eligibleClients: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  
    // NUEVOS CAMPOS:
    minBidIncrement: { 
      type: Number, 
      default: 0.5, 
      required: [true, 'Se requiere el incremento mínimo de puja']
    },
  
    notificationConfig: {
      dailyNotification: {
        type: Boolean,
        default: true
      },
      finalDayNotification: {
        active: { 
          type: Boolean, 
          default: true 
        },
        frequencyHours: {
          type: Number,
          default: 1, // cada 1 hora por defecto
          min: [1, 'La frecuencia mínima debe ser 1 hora'],
          max: [12, 'La frecuencia máxima debe ser 12 horas']
        }
      }
    }
  
  }, { timestamps: true });
  

module.exports = mongoose.model('Auction', AuctionSchema);