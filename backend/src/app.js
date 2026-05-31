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
const userRoutes = require('./routes/userRoutes')
const especialidadRoutes = require('./routes/especialidadRoutes')
const consultorioRoutes = require('./routes/consultorioRoutes')
const horarioRoutes = require('./routes/horarioRoutes')
const errorHandler = require('./middleware/errorHandler')
const publicRoutes = require('./routes/publicRoutes')

const app = express()

// CORS abierto para produccion
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/doctors', doctorRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/records', medicalRecordRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/users', userRoutes)
app.use('/api/especialidades', especialidadRoutes)
app.use('/api/consultorios', consultorioRoutes)
app.use('/api/horarios', horarioRoutes)
app.use('/api/public', publicRoutes)

app.get('/', (req, res) => {
  res.json({
    message: '✅ VitaCare API funcionando correctamente',
    version: '1.0.0'
  })
})

app.use(errorHandler)

module.exports = app