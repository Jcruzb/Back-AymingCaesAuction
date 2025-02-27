const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TYPE = ['Singular', 'Estandarizado']

const ProjectSchema = new Schema({
    title: { 
        type: String, 
        required: [true, 'se requiere el título del proyecto' ]
    },
    projectType: { 
        type: String, 
        enum: TYPE, 
        required: [true, 'Se requiere el título del proyecto'] 
    },
    // Si el proyecto es Estandarizado, se referencia el proyecto estandarizado
    standardizedProject: { 
      type: Schema.Types.ObjectId, 
      ref: 'StandardProject',
      required: function() { return this.projectType === 'Estandarizado'; }
    },
    savingsGenerated: { 
        type: Number, 
        required: true 
    }, 
    attachedDocuments: [{
         type: String 
        }], 
    auction: [{ type: Schema.Types.ObjectId, ref: 'Auction' }] 
  });
  
  module.exports = mongoose.model('Project', ProjectSchema);