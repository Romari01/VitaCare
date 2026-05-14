const PDFDocument = require('pdfkit')
const Patient = require('../models/Patient')
const Appointment = require('../models/Appointment')
const MedicalRecord = require('../models/MedicalRecord')

const generatePatientsReport = async (req, res) => {
  try {
    const patients = await Patient.find({ active: true }).sort({ name: 1 })
    const doc = new PDFDocument({ margin: 50 })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=reporte-pacientes.pdf')
    doc.pipe(res)

    // Header
    doc.fontSize(20).font('Helvetica-Bold').text('VitaCare', 50, 50)
    doc.fontSize(12).font('Helvetica').text('Centro de Salud Jorge Chavez — Juliaca', 50, 75)
    doc.fontSize(16).font('Helvetica-Bold').text('Reporte de Pacientes', 50, 110)
    doc.fontSize(10).font('Helvetica').text(`Generado: ${new Date().toLocaleDateString('es-PE')}`, 50, 132)
    doc.moveTo(50, 150).lineTo(550, 150).stroke()

    // Tabla header
    doc.fontSize(10).font('Helvetica-Bold')
    doc.text('Nombre', 50, 165)
    doc.text('DNI', 250, 165)
    doc.text('Telefono', 330, 165)
    doc.text('Genero', 430, 165)
    doc.moveTo(50, 178).lineTo(550, 178).stroke()

    // Filas
    let y = 190
    patients.forEach((p) => {
      if (y > 720) { doc.addPage(); y = 50 }
      doc.fontSize(9).font('Helvetica')
      doc.text(p.name.substring(0, 25), 50, y)
      doc.text(p.dni, 250, y)
      doc.text(p.phone || '-', 330, y)
      doc.text(p.gender, 430, y)
      y += 20
    })

    doc.fontSize(10).font('Helvetica-Bold')
    doc.text(`Total pacientes: ${patients.length}`, 50, y + 20)
    doc.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const generateAppointmentsReport = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name dni')
      .populate('doctor', 'name specialty')
      .sort({ date: -1 })
      .limit(50)

    const doc = new PDFDocument({ margin: 50 })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=reporte-citas.pdf')
    doc.pipe(res)

    doc.fontSize(20).font('Helvetica-Bold').text('VitaCare', 50, 50)
    doc.fontSize(12).font('Helvetica').text('Centro de Salud Jorge Chavez — Juliaca', 50, 75)
    doc.fontSize(16).font('Helvetica-Bold').text('Reporte de Citas Medicas', 50, 110)
    doc.fontSize(10).font('Helvetica').text(`Generado: ${new Date().toLocaleDateString('es-PE')}`, 50, 132)
    doc.moveTo(50, 150).lineTo(550, 150).stroke()

    doc.fontSize(10).font('Helvetica-Bold')
    doc.text('Paciente', 50, 165)
    doc.text('Medico', 200, 165)
    doc.text('Fecha', 340, 165)
    doc.text('Hora', 420, 165)
    doc.text('Estado', 470, 165)
    doc.moveTo(50, 178).lineTo(550, 178).stroke()

    let y = 190
    appointments.forEach((a) => {
      if (y > 720) { doc.addPage(); y = 50 }
      doc.fontSize(8).font('Helvetica')
      doc.text((a.patient?.name || '-').substring(0, 18), 50, y)
      doc.text((a.doctor?.name || '-').substring(0, 18), 200, y)
      doc.text(new Date(a.date).toLocaleDateString('es-PE'), 340, y)
      doc.text(a.time, 420, y)
      doc.text(a.status, 470, y)
      y += 20
    })

    doc.fontSize(10).font('Helvetica-Bold')
    doc.text(`Total citas: ${appointments.length}`, 50, y + 20)
    doc.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { generatePatientsReport, generateAppointmentsReport }