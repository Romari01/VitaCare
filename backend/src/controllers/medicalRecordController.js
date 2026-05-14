const MedicalRecord = require('../models/MedicalRecord')

const getRecordsByPatient = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.params.patientId })
      .populate('doctor', 'name specialty')
      .populate('appointment', 'date time reason')
      .sort({ createdAt: -1 })
    res.json(records)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.create(req.body)
    const populated = await record.populate([
      { path: 'doctor', select: 'name specialty' },
      { path: 'patient', select: 'name dni' }
    ])
    res.status(201).json(populated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    )
    if (!record) return res.status(404).json({ message: 'Registro no encontrado' })
    res.json(record)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getRecordsByPatient, createRecord, updateRecord }