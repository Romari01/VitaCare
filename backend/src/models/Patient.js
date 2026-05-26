const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema({
  historialNumber: {
    type: String,
    unique: true,
    sparse: true
  },
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
  email: {
    type: String,
    trim: true,
    lowercase: true
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
    enum: ['masculino', 'femenino', 'otro', ''],
    default: ''
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']
  },
  allergies: {
    type: String,
    default: 'Ninguna'
  },
  emergencyContact: {
    type: String,
    trim: true
  },
  occupation: {
    type: String,
    trim: true
  },
  origin: {
    type: String,
    enum: ['local', 'externo'],
    default: 'local'
  },
  hasHistory: {
    type: Boolean,
    default: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Generar número de historial automáticamente
patientSchema.pre('save', async function() {
  if (!this.historialNumber) {
    const count = await mongoose.model('Patient').countDocuments()
    this.historialNumber = `HC-${String(count + 1).padStart(4, '0')}`
  }
})

module.exports = mongoose.model('Patient', patientSchema)