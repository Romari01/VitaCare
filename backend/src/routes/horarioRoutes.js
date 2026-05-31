const express = require('express')
const router = express.Router()
const Horario = require('../models/Horario')
const { protect, authorize } = require('../middleware/authMiddleware')

router.get('/', protect, async (req, res) => {
    try {
        const horarios = await Horario.find().sort({ dia: 1 })
        res.json(horarios)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', protect, authorize('admin', 'admision'), async (req, res) => {
    try {
        const horario = await Horario.create(req.body)
        res.status(201).json(horario)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.put('/:id', protect, authorize('admin', 'admision'), async (req, res) => {
    try {
        const horario = await Horario.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(horario)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.delete('/:id', protect, authorize('admin', 'admision'), async (req, res) => {
    try {
        await Horario.findByIdAndDelete(req.params.id)
        res.json({ message: 'Horario eliminado' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router