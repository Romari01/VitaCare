const mongoose = require('mongoose')

const medicalRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  diagnosis: {
    type: String,
    required: true,
    trim: true
  },
  treatment: {
    type: String,
    required: true,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  weight: Number,
  height: Number,
  bloodPressure: String,
  temperature: Number
}, {
  timestamps: true
})

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema)