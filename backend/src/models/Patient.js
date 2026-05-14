const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  dni: {
    type: String,
    required: [true, 'El DNI es obligatorio'],
    unique: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  birthDate: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['masculino', 'femenino', 'otro'],
    required: true
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  allergies: {
    type: String,
    default: 'Ninguna'
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Patient', patientSchema)