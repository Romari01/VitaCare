const Appointment = require('../models/Appointment')
const Patient = require('../models/Patient')
const Doctor = require('../models/Doctor')

const getAppointments = async (req, res) => {
  try {
    const { date, status, doctor } = req.query
    let query = {}

    // Si es paciente, solo ve SUS citas
    if (req.user.role === 'paciente') {
      const patient = await Patient.findOne({ dni: req.user.dni })
      if (!patient) return res.json([])
      query.patient = patient._id
    }

    // Si es doctor, solo ve SUS citas
    if (req.user.role === 'doctor') {
      const doc = await Doctor.findOne({ email: req.user.email })
      if (!doc) return res.json([])
      query.doctor = doc._id
    }

    if (date) query.date = { $gte: new Date(date), $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) }
    if (status) query.status = status
    if (doctor && req.user.role !== 'doctor') query.doctor = doctor

    const appointments = await Appointment.find(query)
      .populate('patient', 'name dni phone')
      .populate('doctor', 'name specialty')
      .sort({ date: 1, time: 1 })
    res.json(appointments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name dni phone')
      .populate('doctor', 'name specialty')
    if (!appointment) return res.status(404).json({ message: 'Cita no encontrada' })
    res.json(appointment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createAppointment = async (req, res) => {
  try {
    const { doctor, date, time } = req.body
    const existing = await Appointment.findOne({
      doctor, date: new Date(date), time,
      status: { $ne: 'cancelada' }
    })
    if (existing) return res.status(400).json({ message: 'Ese horario ya está ocupado' })
    const appointment = await Appointment.create(req.body)
    const populated = await appointment.populate([
      { path: 'patient', select: 'name dni phone' },
      { path: 'doctor', select: 'name specialty' }
    ])
    res.status(201).json(populated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getPublicAvailability = async (req, res) => {
  try {
    const { doctor } = req.query
    let query = { status: { $ne: 'cancelada' } }
    if (doctor) query.doctor = doctor
    const appointments = await Appointment.find(query)
      .select('date time doctor status')
      .populate('doctor', 'name specialty')
      .sort({ date: 1, time: 1 })
    res.json(appointments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    ).populate('patient', 'name dni').populate('doctor', 'name specialty')
    if (!appointment) return res.status(404).json({ message: 'Cita no encontrada' })
    res.json(appointment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndUpdate(req.params.id, { status: 'cancelada' })
    res.json({ message: 'Cita cancelada correctamente' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getPublicAvailability
}