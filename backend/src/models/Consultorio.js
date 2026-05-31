const mongoose = require('mongoose')

const consultorioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    ubicacion: {
        type: String,
        required: [true, 'La ubicación es obligatoria'],
        trim: true
    },
    capacidad: {
        type: Number,
        default: 10
    },
    telefono: {
        type: String,
        trim: true
    },
    especialidad: {
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

module.exports = mongoose.model('Consultorio', consultorioSchema)