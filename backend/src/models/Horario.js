const mongoose = require('mongoose')

const horarioSchema = new mongoose.Schema({
    doctor: {
        type: String,
        required: [true, 'El doctor es obligatorio'],
        trim: true
    },
    especialidad: {
        type: String,
        trim: true
    },
    dia: {
        type: String,
        required: [true, 'El día es obligatorio'],
        enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    },
    inicio: {
        type: String,
        required: [true, 'La hora de inicio es obligatoria']
    },
    fin: {
        type: String,
        required: [true, 'La hora de fin es obligatoria']
    },
    consultorio: {
        type: String,
        trim: true
    },
    estado: {
        type: String,
        enum: ['ACTIVO', 'INACTIVO'],
        default: 'ACTIVO'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Horario', horarioSchema)