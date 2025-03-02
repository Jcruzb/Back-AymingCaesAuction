// models/Company.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Se requiere el nombre de la compañía'],
        trim: true,
        minLength: [3, 'El nombre debe tener al menos 3 caracteres'],
        maxLength: [100, 'El nombre puede tener hasta 100 caracteres']
    },
    // Puedes agregar otros campos como dirección, logo, etc.
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

module.exports = mongoose.model('Company', companySchema);