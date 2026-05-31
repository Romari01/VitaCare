const express = require('express')
const router = express.Router()
const Consultorio = require('../models/Consultorio')
const { protect, authorize } = require('../middleware/authMiddleware')

router.get('/', protect, async (req, res) => {
    try {
        const consultorios = await Consultorio.find().sort({ createdAt: -1 })
        res.json(consultorios)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', protect, authorize('admin', 'admision'), async (req, res) => {
    try {
        const consultorio = await Consultorio.create(req.body)
        res.status(201).json(consultorio)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.put('/:id', protect, authorize('admin', 'admision'), async (req, res) => {
    try {
        const consultorio = await Consultorio.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(consultorio)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.delete('/:id', protect, authorize('admin', 'admision'), async (req, res) => {
    try {
        await Consultorio.findByIdAndDelete(req.params.id)
        res.json({ message: 'Consultorio eliminado' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router