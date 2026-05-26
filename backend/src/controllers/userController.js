const User = require('../models/User')

// GET todos los usuarios
const getUsers = async (req, res) => {
  try {
    const { role } = req.query
    const filter = role ? { role } : {}
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET usuario por ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// PUT actualizar usuario
const updateUser = async (req, res) => {
  try {
    const { name, email, role, phone, dni, active, password } = req.body
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

    user.name = name || user.name
    user.email = email || user.email
    user.role = role || user.role
    user.phone = phone || user.phone
    user.dni = dni || user.dni
    if (active !== undefined) user.active = active
    if (password && password.length >= 6) user.password = password

    await user.save()
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      dni: user.dni,
      active: user.active
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' })
      if (adminCount <= 1) return res.status(400).json({ message: 'No puedes eliminar el único administrador' })
    }
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'Usuario eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getUsers, getUserById, updateUser, deleteUser }