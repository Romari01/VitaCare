const express = require('express')
const router = express.Router()
const Record = require('../models/MedicalRecord')
const { protect } = require('../middleware/authMiddleware')

// GET todos los registros
router.get('/', protect, async (req, res) => {
    try {
        const records = await Record.find()
            .populate('patient', 'name dni historialNumber')
            .populate('doctor', 'name specialty')
            .populate('appointment')
            .sort({ createdAt: -1 })
        res.json(records)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// GET registros por paciente
router.get('/patient/:patientId', protect, async (req, res) => {
    try {
        const records = await Record.find({ patient: req.params.patientId })
            .populate('patient', 'name dni historialNumber')
            .populate('doctor', 'name specialty')
            .sort({ createdAt: -1 })
        res.json(records)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// POST crear registro
router.post('/', protect, async (req, res) => {
    try {
        const record = new Record(req.body)
        await record.save()
        const populated = await Record.findById(record._id)
            .populate('patient', 'name dni historialNumber')
            .populate('doctor', 'name specialty')
        res.status(201).json(populated)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// PUT actualizar registro
router.put('/:id', protect, async (req, res) => {
    try {
        const record = await Record.findByIdAndUpdate(
            req.params.id, req.body, { new: true }
        )
            .populate('patient', 'name dni historialNumber')
            .populate('doctor', 'name specialty')
        res.json(record)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// DELETE eliminar registro
router.delete('/:id', protect, async (req, res) => {
    try {
        await Record.findByIdAndDelete(req.params.id)
        res.json({ message: 'Registro eliminado' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router