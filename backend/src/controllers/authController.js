const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, dni } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) return res.status(400).json({ message: 'El usuario ya existe' })

    const user = await User.create({
      name, email, password, role,
      phone: phone || '',
      dni: dni || '',
      isVerified: true
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: true,
      message: 'Usuario creado correctamente.'
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const verifyAccount = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

    user.isVerified = true
    await user.save()

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: true,
      token: generateToken(user._id, user.role)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    let user = await User.findOne({ email })

    if (!user) {
      const Patient = require('../models/Patient')
      const patient = await Patient.findOne({
        historialNumber: email.toUpperCase(),
        active: true
      })
      if (patient) {
        user = await User.findOne({ dni: patient.dni })
      }
    }

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Credenciales incorrectas' })
    }
    if (!user.active) return res.status(401).json({ message: 'Usuario inactivo' })

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: true,
      token: generateToken(user._id, user.role)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { sendPasswordResetEmail } = require('../utils/emailService')
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'No existe una cuenta con ese correo' })

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = new Date(Date.now() + 10 * 60 * 1000)

    user.resetCode = code
    user.resetExpires = expires
    await user.save()

    await sendPasswordResetEmail(email, user.name, code)
    res.json({ message: 'Código enviado a tu correo' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    if (user.resetCode !== code) return res.status(400).json({ message: 'Código incorrecto' })
    if (user.resetExpires < new Date()) return res.status(400).json({ message: 'Código expirado' })

    user.password = newPassword
    user.resetCode = undefined
    user.resetExpires = undefined
    await user.save()

    res.json({ message: 'Contraseña actualizada correctamente' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const resendCode = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json({ message: 'Código reenviado' })
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
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const checkPatientAccess = async (req, res) => {
  try {
    const { identifier } = req.body
    const Patient = require('../models/Patient')
    const patient = await Patient.findOne({
      $or: [{ historialNumber: identifier }, { dni: identifier }],
      active: true
    })
    if (!patient) return res.json({ status: 'not_found' })
    const existingUser = await User.findOne({ dni: patient.dni })
    if (existingUser) {
      return res.json({ status: 'has_account', name: patient.name, historialNumber: patient.historialNumber })
    }
    return res.json({ status: 'first_time', name: patient.name, historialNumber: patient.historialNumber, dni: patient.dni })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const registerPatient = async (req, res) => {
  try {
    const { dni, email, phone, password } = req.body
    const Patient = require('../models/Patient')
    const patient = await Patient.findOne({ dni, active: true })
    if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' })
    const userExists = await User.findOne({ email })
    if (userExists) return res.status(400).json({ message: 'Este email ya está registrado' })

    const user = await User.create({
      name: patient.name, email, password,
      role: 'paciente', dni,
      phone: phone || '',
      isVerified: true
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: true,
      token: generateToken(user._id, user.role),
      message: 'Cuenta creada correctamente.'
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  register, login, getProfile, updateProfile,
  checkPatientAccess, registerPatient,
  verifyAccount, forgotPassword, resetPassword, resendCode
}