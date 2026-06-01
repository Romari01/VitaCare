const PDFDocument = require('pdfkit')
const ExcelJS = require('exceljs')
const Patient = require('../models/Patient')
const Appointment = require('../models/Appointment')
const Doctor = require('../models/Doctor')
const Especialidad = require('../models/Especialidad')

const headerPDF = (doc, title) => {
  doc.fontSize(20).font('Helvetica-Bold').fillColor('#0d9488').text('VitaCare', 50, 50)
  doc.fontSize(11).font('Helvetica').fillColor('#64748b').text('Centro de Salud Jorge Chavez — Juliaca, Puno', 50, 75)
  doc.fontSize(16).font('Helvetica-Bold').fillColor('#1e293b').text(title, 50, 105)
  doc.fontSize(9).font('Helvetica').fillColor('#94a3b8').text(`Generado: ${new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 50, 128)
  doc.moveTo(50, 145).lineTo(550, 145).strokeColor('#e2e8f0').stroke()
}

// ===== PACIENTES PDF =====
const generatePatientsReport = async (req, res) => {
  try {
    const patients = await Patient.find({ active: true }).sort({ name: 1 })
    const doc = new PDFDocument({ margin: 50, size: 'A4' })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=reporte-pacientes.pdf')
    doc.pipe(res)

    headerPDF(doc, 'Reporte de Pacientes')

    // Tabla header
    let y = 160
    doc.fontSize(8).font('Helvetica-Bold').fillColor('#475569')
    doc.text('N°', 50, y)
    doc.text('Nombre Completo', 70, y)
    doc.text('DNI', 230, y)
    doc.text('N° Historial', 290, y)
    doc.text('Teléfono', 370, y)
    doc.text('Género', 440, y)
    doc.text('Origen', 490, y)
    doc.moveTo(50, y + 12).lineTo(550, y + 12).strokeColor('#e2e8f0').stroke()

    y += 20
    patients.forEach((p, i) => {
      if (y > 750) {
        doc.addPage()
        y = 50
        headerPDF(doc, 'Reporte de Pacientes (continuación)')
        y = 80
      }
      const bg = i % 2 === 0 ? '#f8fafc' : '#ffffff'
      doc.rect(50, y - 3, 500, 16).fill(bg)
      doc.fontSize(8).font('Helvetica').fillColor('#334155')
      doc.text(String(i + 1), 50, y)
      doc.text((p.name || '-').substring(0, 22), 70, y)
      doc.text(p.dni || '-', 230, y)
      doc.text(p.historialNumber || '-', 290, y)
      doc.text(p.phone || '-', 370, y)
      doc.text(p.gender || '-', 440, y)
      doc.text(p.origin || '-', 490, y)
      y += 16
    })

    doc.moveTo(50, y + 5).lineTo(550, y + 5).strokeColor('#e2e8f0').stroke()
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#0d9488')
    doc.text(`Total de pacientes registrados: ${patients.length}`, 50, y + 15)
    doc.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ===== PACIENTES EXCEL =====
const generatePatientsExcel = async (req, res) => {
  try {
    const patients = await Patient.find({ active: true }).sort({ name: 1 })
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Pacientes')

    sheet.columns = [
      { header: 'N°', key: 'num', width: 5 },
      { header: 'Nombre Completo', key: 'name', width: 30 },
      { header: 'DNI', key: 'dni', width: 12 },
      { header: 'N° Historial', key: 'historial', width: 14 },
      { header: 'Teléfono', key: 'phone', width: 14 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Género', key: 'gender', width: 12 },
      { header: 'Fecha Nacimiento', key: 'birthDate', width: 18 },
      { header: 'Dirección', key: 'address', width: 30 },
      { header: 'Origen', key: 'origin', width: 10 },
      { header: 'Fecha Registro', key: 'createdAt', width: 18 },
    ]

    sheet.getRow(1).eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0D9488' } }
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
      cell.alignment = { horizontal: 'center' }
    })

    patients.forEach((p, i) => {
      sheet.addRow({
        num: i + 1,
        name: p.name || '-',
        dni: p.dni || '-',
        historial: p.historialNumber || '-',
        phone: p.phone || '-',
        email: p.email || '-',
        gender: p.gender || '-',
        birthDate: p.birthDate ? new Date(p.birthDate).toLocaleDateString('es-PE') : '-',
        address: p.address || '-',
        origin: p.origin || '-',
        createdAt: new Date(p.createdAt).toLocaleDateString('es-PE'),
      })
    })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=reporte-pacientes.xlsx')
    await workbook.xlsx.write(res)
    res.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ===== CITAS PDF =====
const generateAppointmentsReport = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name dni historialNumber')
      .populate('doctor', 'name specialty')
      .sort({ date: -1 })

    const doc = new PDFDocument({ margin: 50, size: 'A4', layout: 'landscape' })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=reporte-citas.pdf')
    doc.pipe(res)

    headerPDF(doc, 'Reporte de Citas Medicas')

    let y = 160
    doc.fontSize(8).font('Helvetica-Bold').fillColor('#475569')
    doc.text('N°', 30, y)
    doc.text('Paciente', 55, y)
    doc.text('DNI', 185, y)
    doc.text('Historial', 235, y)
    doc.text('Médico', 290, y)
    doc.text('Especialidad', 420, y)
    doc.text('Fecha', 530, y)
    doc.text('Hora', 590, y)
    doc.text('Estado', 635, y)
    doc.moveTo(30, y + 12).lineTo(760, y + 12).strokeColor('#e2e8f0').stroke()

    y += 20
    appointments.forEach((a, i) => {
      if (y > 530) {
        doc.addPage()
        y = 50
        headerPDF(doc, 'Reporte de Citas (continuación)')
        y = 80
      }
      const bg = i % 2 === 0 ? '#f8fafc' : '#ffffff'
      doc.rect(30, y - 3, 730, 16).fill(bg)
      doc.fontSize(7.5).font('Helvetica').fillColor('#334155')
      doc.text(String(i + 1), 30, y)
      doc.text((a.patient?.name || '-').substring(0, 18), 55, y)
      doc.text(a.patient?.dni || '-', 185, y)
      doc.text(a.patient?.historialNumber || '-', 235, y)
      doc.text((a.doctor?.name || '-').substring(0, 18), 290, y)
      doc.text((a.doctor?.specialty || '-').substring(0, 16), 420, y)
      doc.text(new Date(a.date).toLocaleDateString('es-PE'), 530, y)
      doc.text(a.time || '-', 590, y)
      doc.text(a.status || '-', 635, y)
      y += 16
    })

    doc.moveTo(30, y + 5).lineTo(760, y + 5).strokeColor('#e2e8f0').stroke()
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#0d9488')
    doc.text(`Total de citas: ${appointments.length}`, 30, y + 15)
    doc.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ===== CITAS EXCEL =====
const generateAppointmentsExcel = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name dni historialNumber')
      .populate('doctor', 'name specialty')
      .sort({ date: -1 })

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Citas Médicas')

    sheet.columns = [
      { header: 'N°', key: 'num', width: 5 },
      { header: 'Paciente', key: 'patient', width: 28 },
      { header: 'DNI', key: 'dni', width: 12 },
      { header: 'N° Historial', key: 'historial', width: 14 },
      { header: 'Médico', key: 'doctor', width: 28 },
      { header: 'Especialidad', key: 'specialty', width: 20 },
      { header: 'Fecha', key: 'date', width: 14 },
      { header: 'Hora', key: 'time', width: 10 },
      { header: 'Estado', key: 'status', width: 14 },
      { header: 'Motivo', key: 'reason', width: 30 },
    ]

    sheet.getRow(1).eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0D9488' } }
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
      cell.alignment = { horizontal: 'center' }
    })

    appointments.forEach((a, i) => {
      sheet.addRow({
        num: i + 1,
        patient: a.patient?.name || '-',
        dni: a.patient?.dni || '-',
        historial: a.patient?.historialNumber || '-',
        doctor: a.doctor?.name || '-',
        specialty: a.doctor?.specialty || '-',
        date: new Date(a.date).toLocaleDateString('es-PE'),
        time: a.time || '-',
        status: a.status || '-',
        reason: a.reason || '-',
      })
    })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=reporte-citas.xlsx')
    await workbook.xlsx.write(res)
    res.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ===== MÉDICOS PDF =====
const generateDoctorsReport = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ specialty: 1 })
    const doc = new PDFDocument({ margin: 50, size: 'A4' })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=reporte-medicos.pdf')
    doc.pipe(res)

    headerPDF(doc, 'Reporte de Médicos')

    let y = 160
    doc.fontSize(8).font('Helvetica-Bold').fillColor('#475569')
    doc.text('N°', 50, y)
    doc.text('Nombre Completo', 75, y)
    doc.text('Especialidad', 250, y)
    doc.text('CMP', 370, y)
    doc.text('Teléfono', 420, y)
    doc.text('Email', 490, y)
    doc.moveTo(50, y + 12).lineTo(550, y + 12).strokeColor('#e2e8f0').stroke()

    y += 20
    doctors.forEach((d, i) => {
      if (y > 750) { doc.addPage(); y = 50 }
      const bg = i % 2 === 0 ? '#f8fafc' : '#ffffff'
      doc.rect(50, y - 3, 500, 16).fill(bg)
      doc.fontSize(8).font('Helvetica').fillColor('#334155')
      doc.text(String(i + 1), 50, y)
      doc.text((d.name || '-').substring(0, 22), 75, y)
      doc.text((d.specialty || '-').substring(0, 18), 250, y)
      doc.text(d.cmp || '-', 370, y)
      doc.text(d.phone || '-', 420, y)
      doc.text((d.email || '-').substring(0, 18), 490, y)
      y += 16
    })

    doc.moveTo(50, y + 5).lineTo(550, y + 5).strokeColor('#e2e8f0').stroke()
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#0d9488')
    doc.text(`Total de médicos: ${doctors.length}`, 50, y + 15)
    doc.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ===== MÉDICOS EXCEL =====
const generateDoctorsExcel = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ specialty: 1 })
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Médicos')

    sheet.columns = [
      { header: 'N°', key: 'num', width: 5 },
      { header: 'Nombre Completo', key: 'name', width: 30 },
      { header: 'Especialidad', key: 'specialty', width: 22 },
      { header: 'CMP', key: 'cmp', width: 12 },
      { header: 'Teléfono', key: 'phone', width: 14 },
      { header: 'Email', key: 'email', width: 28 },
    ]

    sheet.getRow(1).eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0D9488' } }
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
      cell.alignment = { horizontal: 'center' }
    })

    doctors.forEach((d, i) => {
      sheet.addRow({
        num: i + 1,
        name: d.name || '-',
        specialty: d.specialty || '-',
        cmp: d.cmp || '-',
        phone: d.phone || '-',
        email: d.email || '-',
      })
    })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=reporte-medicos.xlsx')
    await workbook.xlsx.write(res)
    res.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ===== ESPECIALIDADES PDF =====
const generateSpecialtiesReport = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctor', 'specialty')

    const specialtyCount = {}
    appointments.forEach(a => {
      const sp = a.doctor?.specialty || 'Sin especialidad'
      specialtyCount[sp] = (specialtyCount[sp] || 0) + 1
    })

    const data = Object.entries(specialtyCount).sort((a, b) => b[1] - a[1])

    const doc = new PDFDocument({ margin: 50, size: 'A4' })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=reporte-especialidades.pdf')
    doc.pipe(res)

    headerPDF(doc, 'Reporte por Especialidad')

    let y = 160
    doc.fontSize(8).font('Helvetica-Bold').fillColor('#475569')
    doc.text('N°', 50, y)
    doc.text('Especialidad', 80, y)
    doc.text('Total Citas', 350, y)
    doc.text('Porcentaje', 450, y)
    doc.moveTo(50, y + 12).lineTo(550, y + 12).strokeColor('#e2e8f0').stroke()

    y += 20
    const total = appointments.length
    data.forEach(([specialty, count], i) => {
      if (y > 750) { doc.addPage(); y = 50 }
      const bg = i % 2 === 0 ? '#f8fafc' : '#ffffff'
      doc.rect(50, y - 3, 500, 16).fill(bg)
      doc.fontSize(8).font('Helvetica').fillColor('#334155')
      doc.text(String(i + 1), 50, y)
      doc.text(specialty.substring(0, 30), 80, y)
      doc.text(String(count), 350, y)
      doc.text(`${((count / total) * 100).toFixed(1)}%`, 450, y)
      y += 16
    })

    doc.moveTo(50, y + 5).lineTo(550, y + 5).strokeColor('#e2e8f0').stroke()
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#0d9488')
    doc.text(`Total de citas: ${total}`, 50, y + 15)
    doc.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ===== ESPECIALIDADES EXCEL =====
const generateSpecialtiesExcel = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('doctor', 'specialty')
    const specialtyCount = {}
    appointments.forEach(a => {
      const sp = a.doctor?.specialty || 'Sin especialidad'
      specialtyCount[sp] = (specialtyCount[sp] || 0) + 1
    })
    const data = Object.entries(specialtyCount).sort((a, b) => b[1] - a[1])
    const total = appointments.length

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Por Especialidad')

    sheet.columns = [
      { header: 'N°', key: 'num', width: 5 },
      { header: 'Especialidad', key: 'specialty', width: 25 },
      { header: 'Total Citas', key: 'count', width: 14 },
      { header: 'Porcentaje', key: 'percent', width: 14 },
    ]

    sheet.getRow(1).eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0D9488' } }
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
      cell.alignment = { horizontal: 'center' }
    })

    data.forEach(([specialty, count], i) => {
      sheet.addRow({
        num: i + 1,
        specialty,
        count,
        percent: `${((count / total) * 100).toFixed(1)}%`,
      })
    })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=reporte-especialidades.xlsx')
    await workbook.xlsx.write(res)
    res.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ===== RESUMEN DEL MES PDF =====
const generateSummaryReport = async (req, res) => {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const [patients, appointments, doctors] = await Promise.all([
      Patient.find({ active: true }),
      Appointment.find({ date: { $gte: startOfMonth, $lte: endOfMonth } })
        .populate('doctor', 'specialty'),
      Doctor.find()
    ])

    const doc = new PDFDocument({ margin: 50, size: 'A4' })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=resumen-mes.pdf')
    doc.pipe(res)

    const monthName = now.toLocaleString('es-PE', { month: 'long', year: 'numeric' })
    headerPDF(doc, `Resumen del Mes — ${monthName}`)

    let y = 165
    const stats = [
      { label: 'Total pacientes registrados', value: patients.length },
      { label: 'Citas del mes', value: appointments.length },
      { label: 'Citas atendidas', value: appointments.filter(a => a.status === 'atendida').length },
      { label: 'Citas confirmadas', value: appointments.filter(a => a.status === 'confirmada').length },
      { label: 'Citas pendientes', value: appointments.filter(a => a.status === 'pendiente').length },
      { label: 'Citas canceladas', value: appointments.filter(a => a.status === 'cancelada').length },
      { label: 'Total médicos activos', value: doctors.length },
    ]

    doc.fontSize(12).font('Helvetica-Bold').fillColor('#1e293b').text('Estadísticas Generales', 50, y)
    y += 20

    stats.forEach((s, i) => {
      const bg = i % 2 === 0 ? '#f8fafc' : '#ffffff'
      doc.rect(50, y - 3, 500, 20).fill(bg)
      doc.fontSize(10).font('Helvetica').fillColor('#334155').text(s.label, 60, y)
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#0d9488').text(String(s.value), 480, y)
      y += 20
    })

    // Citas por especialidad
    const specialtyCount = {}
    appointments.forEach(a => {
      const sp = a.doctor?.specialty || 'Sin especialidad'
      specialtyCount[sp] = (specialtyCount[sp] || 0) + 1
    })
    const specialtyData = Object.entries(specialtyCount).sort((a, b) => b[1] - a[1])

    y += 20
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#1e293b').text('Citas por Especialidad', 50, y)
    y += 20

    specialtyData.forEach(([sp, count], i) => {
      const bg = i % 2 === 0 ? '#f8fafc' : '#ffffff'
      doc.rect(50, y - 3, 500, 16).fill(bg)
      doc.fontSize(9).font('Helvetica').fillColor('#334155').text(sp, 60, y)
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#0d9488').text(String(count), 480, y)
      y += 16
    })

    doc.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ===== RESUMEN EXCEL =====
const generateSummaryExcel = async (req, res) => {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const [patients, appointments, doctors] = await Promise.all([
      Patient.find({ active: true }),
      Appointment.find({ date: { $gte: startOfMonth, $lte: endOfMonth } }).populate('doctor', 'specialty'),
      Doctor.find()
    ])

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Resumen del Mes')

    sheet.addRow(['Resumen del Mes — ' + now.toLocaleString('es-PE', { month: 'long', year: 'numeric' })])
    sheet.addRow([])
    sheet.addRow(['Estadística', 'Valor'])

    const stats = [
      ['Total pacientes', patients.length],
      ['Citas del mes', appointments.length],
      ['Citas atendidas', appointments.filter(a => a.status === 'atendida').length],
      ['Citas confirmadas', appointments.filter(a => a.status === 'confirmada').length],
      ['Citas pendientes', appointments.filter(a => a.status === 'pendiente').length],
      ['Citas canceladas', appointments.filter(a => a.status === 'cancelada').length],
      ['Total médicos', doctors.length],
    ]

    stats.forEach(s => sheet.addRow(s))
    sheet.addRow([])
    sheet.addRow(['Especialidad', 'Total Citas'])

    const specialtyCount = {}
    appointments.forEach(a => {
      const sp = a.doctor?.specialty || 'Sin especialidad'
      specialtyCount[sp] = (specialtyCount[sp] || 0) + 1
    })
    Object.entries(specialtyCount).sort((a, b) => b[1] - a[1]).forEach(([sp, c]) => sheet.addRow([sp, c]))

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=resumen-mes.xlsx')
    await workbook.xlsx.write(res)
    res.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  generatePatientsReport, generatePatientsExcel,
  generateAppointmentsReport, generateAppointmentsExcel,
  generateDoctorsReport, generateDoctorsExcel,
  generateSpecialtiesReport, generateSpecialtiesExcel,
  generateSummaryReport, generateSummaryExcel,
}