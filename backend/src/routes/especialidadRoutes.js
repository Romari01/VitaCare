const express = require('express')
const router = express.Router()
const Especialidad = require('../models/Especialidad')
const { protect, authorize } = require('../middleware/authMiddleware')

// GET todas las especialidades
router.get('/', protect, async (req, res) => {
    try {
        const especialidades = await Especialidad.find().sort({ nombre: 1 })
        res.json(especialidades)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// GET solo activas (para formularios)
router.get('/activas', protect, async (req, res) => {
    try {
        const especialidades = await Especialidad.find({ activo: true }).sort({ nombre: 1 })
        res.json(especialidades)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// POST crear especialidad
router.post('/', protect, authorize('admin', 'admision'), async (req, res) => {
    try {
        const especialidad = await Especialidad.create(req.body)
        res.status(201).json(especialidad)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// PUT actualizar especialidad
router.put('/:id', protect, authorize('admin', 'admision'), async (req, res) => {
    try {
        const especialidad = await Especialidad.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(especialidad)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// DELETE eliminar especialidad
router.delete('/:id', protect, authorize('admin', 'admision'), async (req, res) => {
    try {
        await Especialidad.findByIdAndDelete(req.params.id)
        res.json({ message: 'Especialidad eliminada' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router