const express = require('express')
const router = express.Router()
const {
  getAppointments, getAppointmentById,
  createAppointment, updateAppointment, deleteAppointment,
  getPublicAvailability
} = require('../controllers/appointmentController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)
router.get('/availability', getPublicAvailability) // ← para el calendario
router.get('/', getAppointments)
router.get('/:id', getAppointmentById)
router.post('/', createAppointment)
router.put('/:id', updateAppointment)
router.delete('/:id', deleteAppointment)

module.exports = router