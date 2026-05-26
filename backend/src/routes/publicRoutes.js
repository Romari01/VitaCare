const express = require('express')
const router = express.Router()
const Patient = require('../models/Patient')
const Doctor = require('../models/Doctor')
const axios = require('axios')

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

// RENIEC — usando apiperu.dev (gratuita, sin token)
router.get('/reniec/:dni', async (req, res) => {
  try {
    const { dni } = req.params
    console.log('Consultando RENIEC para DNI:', dni)

    const response = await axios.get(
      `https://apiperu.dev/api/dni/${dni}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      }
    )
    console.log('RENIEC respuesta:', response.data)
    res.json(response.data)
  } catch (error) {
    console.error('RENIEC error:', error.response?.data || error.message)
    res.json({ found: false })
  }
})

module.exports = router