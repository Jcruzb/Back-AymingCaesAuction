const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StandardProjectSchema = new Schema({
    code:{
        type: String,
        required: [true, 'Se requiere el código de ficha']
    },
    name: { 
        type: String, 
        required: [true, 'se requiere el nombre de la ficha' ]
    },
    description: { 
        type: String 
    } 
  });
  
  module.exports = mongoose.model('StandardProject', StandardProjectSchema);