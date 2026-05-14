const Patient = require('../models/Patient')
const Doctor = require('../models/Doctor')
const Appointment = require('../models/Appointment')
const MedicalRecord = require('../models/MedicalRecord')

const getStats = async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      attendedAppointments,
      totalRecords
    ] = await Promise.all([
      Patient.countDocuments({ active: true }),
      Doctor.countDocuments({ active: true }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ date: { $gte: today, $lt: tomorrow } }),
      Appointment.countDocuments({ status: 'pendiente' }),
      Appointment.countDocuments({ status: 'atendida' }),
      MedicalRecord.countDocuments()
    ])

    // Citas por estado
    const appointmentsByStatus = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    // Ultimas 5 citas
    const recentAppointments = await Appointment.find()
      .populate('patient', 'name')
      .populate('doctor', 'name specialty')
      .sort({ createdAt: -1 })
      .limit(5)

    res.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      attendedAppointments,
      totalRecords,
      appointmentsByStatus,
      recentAppointments
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getStats }