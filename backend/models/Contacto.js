const mongoose = require('mongoose');

// Esquema simple para guardar los mensajes del formulario de contacto
const ContactoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    mensaje: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Contacto', ContactoSchema);

