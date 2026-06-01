const express = require('express')
const router = express.Router()
const {
    generatePatientsReport, generatePatientsExcel,
    generateAppointmentsReport, generateAppointmentsExcel,
    generateDoctorsReport, generateDoctorsExcel,
    generateSpecialtiesReport, generateSpecialtiesExcel,
    generateSummaryReport, generateSummaryExcel,
} = require('../controllers/reportController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)

router.get('/patients', generatePatientsReport)
router.get('/patients/excel', generatePatientsExcel)
router.get('/appointments', generateAppointmentsReport)
router.get('/appointments/excel', generateAppointmentsExcel)
router.get('/doctors', generateDoctorsReport)
router.get('/doctors/excel', generateDoctorsExcel)
router.get('/specialties', generateSpecialtiesReport)
router.get('/specialties/excel', generateSpecialtiesExcel)
router.get('/summary', generateSummaryReport)
router.get('/summary/excel', generateSummaryExcel)

module.exports = router