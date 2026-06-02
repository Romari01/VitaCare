const Patient = require('../models/Patient')
const Appointment = require('../models/Appointment')
const Doctor = require('../models/Doctor')

const getPatients = async (req, res) => {
  try {
    const { search } = req.query
    let query = { active: true }

    // Si es doctor, solo ve sus pacientes
    if (req.user.role === 'doctor') {
      const doc = await Doctor.findOne({ email: req.user.email })
      if (!doc) return res.json([])
      const appointments = await Appointment.find({ doctor: doc._id })
        .distinct('patient')
      query._id = { $in: appointments }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { dni: { $regex: search, $options: 'i' } }
      ]
    }

    const patients = await Patient.find(query).sort({ createdAt: -1 })
    res.json(patients)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
    if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' })
    res.json(patient)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body)
    res.status(201).json(patient)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    )
    if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' })
    res.json(patient)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndUpdate(req.params.id, { active: false })
    res.json({ message: 'Paciente eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getPatients, getPatientById, createPatient, updatePatient, deletePatient }