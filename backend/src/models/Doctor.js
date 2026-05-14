const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  specialty: {
    type: String,
    required: [true, 'La especialidad es obligatoria'],
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  cmp: {
    type: String,
    unique: true,
    trim: true
  },
  schedule: [{
    day: {
      type: String,
      enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
    },
    startTime: String,
    endTime: String
  }],
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Doctor', doctorSchema)