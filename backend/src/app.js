const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const patientRoutes = require('./routes/patientRoutes')
const doctorRoutes = require('./routes/doctorRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes')
const medicalRecordRoutes = require('./routes/medicalRecordRoutes')
const statsRoutes = require('./routes/statsRoutes')
const reportRoutes = require('./routes/reportRoutes')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://vita-care-amber.vercel.app',
    process.env.CLIENT_URL
  ],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/doctors', doctorRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/records', medicalRecordRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/reports', reportRoutes)

app.get('/', (req, res) => {
  res.json({
    message: '✅ VitaCare API funcionando correctamente',
    version: '1.0.0'
  })
})

app.use(errorHandler)

module.exports = app