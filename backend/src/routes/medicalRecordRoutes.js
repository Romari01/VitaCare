const express = require('express')
const router = express.Router()
const { getRecordsByPatient, createRecord, updateRecord } = require('../controllers/medicalRecordController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)
router.get('/patient/:patientId', getRecordsByPatient)
router.post('/', createRecord)
router.put('/:id', updateRecord)

module.exports = router