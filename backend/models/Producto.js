const mongoose = require('mongoose');

// Esquema simple para los productos artesanales inspirados en Studio Ghibli
const ProductoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    imagen: {
        type: String,
        required: true
    },
    personaje: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Producto', ProductoSchema);

