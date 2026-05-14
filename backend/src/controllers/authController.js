const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Generar JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  })
}

// @desc Register usuario
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

// @desc Login usuario
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

// @desc Obtener perfil
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { register, login, getProfile }