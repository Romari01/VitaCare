const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  })
}

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' })
    }
    const user = await User.create({ name, email, password, role })
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Credenciales incorrectas' })
    }
    if (!user.active) {
      return res.status(401).json({ message: 'Usuario inactivo' })
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: 'Ingresa tu contraseña actual' })
      const isMatch = await user.matchPassword(currentPassword)
      if (!isMatch) return res.status(400).json({ message: 'Contraseña actual incorrecta' })
      user.password = newPassword
    }
    user.name = name || user.name
    user.email = email || user.email
    await user.save()
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const checkPatientAccess = async (req, res) => {
  try {
    const { identifier } = req.body
    const Patient = require('../models/Patient')

    const patient = await Patient.findOne({
      $or: [
        { historialNumber: identifier },
        { dni: identifier }
      ],
      active: true
    })

    if (!patient) {
      return res.json({ status: 'not_found' })
    }

    const existingUser = await User.findOne({ dni: patient.dni })
    if (existingUser) {
      return res.json({
        status: 'has_account',
        name: patient.name,
        historialNumber: patient.historialNumber
      })
    }

    return res.json({
      status: 'first_time',
      name: patient.name,
      historialNumber: patient.historialNumber,
      dni: patient.dni
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const registerPatient = async (req, res) => {
  try {
    const { dni, email, phone, password, confirmMethod } = req.body
    const Patient = require('../models/Patient')

    const patient = await Patient.findOne({ dni, active: true })
    if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' })

    const userExists = await User.findOne({ email })
    if (userExists) return res.status(400).json({ message: 'Este email ya está registrado' })

    const user = await User.create({
      name: patient.name,
      email,
      password,
      role: 'paciente',
      dni,
      phone: phone || '',
      passwordChanged: true
    })

    // Enviar confirmación por email
    if (confirmMethod === 'email' && email) {
      try {
        const nodemailer = require('nodemailer')
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        })
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: '✅ Cuenta creada — VitaCare',
          html: `
            <h2>¡Bienvenido a VitaCare!</h2>
            <p>Hola <strong>${patient.name}</strong>,</p>
            <p>Tu cuenta ha sido creada exitosamente.</p>
            <p>N° de Historial: <strong>${patient.historialNumber}</strong></p>
            <p>Centro de Salud Jorge Chávez — Juliaca</p>
          `
        })
      } catch (emailError) {
        console.error('Error enviando email:', emailError.message)
      }
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { register, login, getProfile, updateProfile, checkPatientAccess, registerPatient }