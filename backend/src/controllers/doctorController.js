const Doctor = require('../models/Doctor')

const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ active: true }).sort({ name: 1 })
    res.json(doctors)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
    if (!doctor) return res.status(404).json({ message: 'Médico no encontrado' })
    res.json(doctor)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body)
    res.status(201).json(doctor)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    )
    if (!doctor) return res.status(404).json({ message: 'Médico no encontrado' })
    res.json(doctor)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteDoctor = async (req, res) => {
  try {
    await Doctor.findByIdAndUpdate(req.params.id, { active: false })
    res.json({ message: 'Médico eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor }