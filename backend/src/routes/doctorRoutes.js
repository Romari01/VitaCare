const express = require('express')
const router = express.Router()
const {
  getDoctors, getDoctorById,
  createDoctor, updateDoctor, deleteDoctor
} = require('../controllers/doctorController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)
router.get('/', getDoctors)
router.get('/:id', getDoctorById)
router.post('/', createDoctor)
router.put('/:id', updateDoctor)
router.delete('/:id', deleteDoctor)

module.exports = router