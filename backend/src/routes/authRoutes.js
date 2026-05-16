const express = require('express')
const router = express.Router()
const {
  register, login, getProfile,
  updateProfile, checkPatientAccess, registerPatient
} = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', register)
router.post('/login', login)
router.post('/check-patient', checkPatientAccess)
router.post('/register-patient', registerPatient)
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)

module.exports = router