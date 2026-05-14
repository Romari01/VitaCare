const express = require('express')
const router = express.Router()
const { generatePatientsReport, generateAppointmentsReport } = require('../controllers/reportController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)
router.get('/patients', generatePatientsReport)
router.get('/appointments', generateAppointmentsReport)

module.exports = router