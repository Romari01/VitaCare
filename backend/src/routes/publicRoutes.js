const express = require('express')
const router = express.Router()
const Patient = require('../models/Patient')
const Doctor = require('../models/Doctor')

router.get('/check-patient/:dni', async (req, res) => {
  try {
    const patient = await Patient.findOne({ dni: req.params.dni, active: true })
    if (!patient) return res.json({ found: false })
    res.json({
      found: true,
      name: patient.name,
      origin: patient.origin,
      hasHistory: patient.hasHistory
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/doctors/:specialty', async (req, res) => {
  try {
    const doctors = await Doctor.find({ specialty: req.params.specialty, active: true })
      .select('name specialty cmp')
    res.json(doctors)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router