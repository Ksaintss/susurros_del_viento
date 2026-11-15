const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importamos los 3 modelos de nuestra base de datos
const Usuario = require('./models/Usuario');
const Producto = require('./models/Producto');
const Contacto = require('./models/Contacto');

const app = express();
const PUERTO = 3000;

// Configuraciones básicas de Express
app.use(cors());
app.use(express.json());

// Conexión directa a MongoDB local
mongoose.connect('mongodb://127.0.0.1:27017/tienda_ghibli')
    .then(async () => {
        console.log('Conectado correctamente a MongoDB (tienda_ghibli)');
        await cargarProductosIniciales();
    })
    .catch((error) => {
        console.log('Error al conectar a MongoDB:', error.message);
    });

// Función sencilla para crear productos de ejemplo si la base de datos está vacía
async function cargarProductosIniciales() {
    try {
        const cantidad = await Producto.countDocuments();
        if (cantidad === 0) {
            await Producto.insertMany([
                {
                    nombre: 'Amigurumi Totoro Guardián del Bosque',
                    descripcion: 'Muñeco tejido a mano en crochet con hilo de algodón hipoalergénico y hojita bordada.',
                    precio: 65000,
                    imagen: 'assets/img/Totoro.jpg',
                    personaje: 'Totoro'
                },
                {
                    nombre: 'Lámpara Artesanal Calcifer en Resina',
                    descripcion: 'Pequeña lámpara de escritorio moldeada y pintada a mano con luz cálida tipo fogata.',
                    precio: 85000,
                    imagen: 'assets/img/Calcifer.jpg',
                    personaje: 'Calcifer'
                },
                {
                    nombre: 'Taza de Cerámica Sin Cara (Kaonashi)',
                    descripcion: 'Taza torneada en arcilla y esmaltada a mano en horno artesanal, capacidad de 350 ml.',
                    precio: 48000,
                    imagen: 'assets/img/SinCara.jpg',
                    personaje: 'Sin Cara'
                },
                {
                    nombre: 'Máscara Decorativa Princesa Mononoke',
                    descripcion: 'Escultura de pared tallada en madera liviana y pintada con acrílicos mates.',
                    precio: 92000,
                    imagen: 'assets/img/Mononoke.jpg',
                    personaje: 'Mononoke'
                },
                {
                    nombre: 'Terrario de Cristal Ponyo en el Mar',
                    descripcion: 'Mini escenario hecho a mano con figuras en porcelana fría y piedras naturales.',
                    precio: 58000,
                    imagen: 'assets/img/Ponyo.jpg',
                    personaje: 'Ponyo'
                },
                {
                    nombre: 'Tote Bag Bordada Jiji y Kiki',
                    descripcion: 'Bolso de lienzo crudo 100% algodón con bordado artesanal hecho puntada a puntada.',
                    precio: 42000,
                    imagen: 'assets/img/Kiki.jpg',
                    personaje: 'Kiki'
                }
            ]);
            console.log('Productos iniciales de Ghibli insertados en la base de datos.');
        }
    } catch (error) {
        console.log('No se pudieron insertar productos iniciales:', error.message);
    }
}

// ==========================================
// RUTAS DE USUARIOS (REGISTRO Y LOGIN)
// ==========================================

// Registrar un nuevo usuario
app.post('/api/registro', async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;

        const existeUsuario = await Usuario.findOne({ correo: correo });
        if (existeUsuario) {
            return res.status(400).json({ mensaje: 'Este correo ya está registrado.' });
        }

        const nuevoUsuario = new Usuario({ nombre, correo, password });
        await nuevoUsuario.save();

        res.json({
            mensaje: 'Usuario registrado con éxito.',
            usuario: {
                nombre: nuevoUsuario.nombre,
                correo: nuevoUsuario.correo
            }
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar usuario.' });
    }
});

// Iniciar sesión de usuario
app.post('/api/login', async (req, res) => {
    try {
        const { correo, password } = req.body;

        const usuarioEncontrado = await Usuario.findOne({ correo: correo, password: password });
        if (!usuarioEncontrado) {
            return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.' });
        }

        res.json({
            mensaje: 'Inicio de sesión exitoso.',
            usuario: {
                nombre: usuarioEncontrado.nombre,
                correo: usuarioEncontrado.correo
            }
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor al iniciar sesión.' });
    }
});

// ==========================================
// RUTAS DE PRODUCTOS ARTESANALES
// ==========================================

// Obtener todos los productos
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los productos.' });
    }
});

// Crear un nuevo producto artesanal desde el Dashboard
app.post('/api/productos', async (req, res) => {
    try {
        const { nombre, descripcion, precio, imagen, personaje } = req.body;

        const nuevoProducto = new Producto({
            nombre,
            descripcion,
            precio: Number(precio),
            imagen,
            personaje
        });

        await nuevoProducto.save();
        res.json({
            mensaje: 'Producto artesanal guardado correctamente.',
            producto: nuevoProducto
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al guardar el producto.' });
    }
});

// Eliminar un producto desde el Dashboard
app.delete('/api/productos/:id', async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Producto eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el producto.' });
    }
});

// ==========================================
// RUTAS DE CONTACTO
// ==========================================

// Guardar un mensaje enviado desde Contacto.html
app.post('/api/contacto', async (req, res) => {
    try {
        const { nombre, correo, mensaje } = req.body;

        const nuevoMensaje = new Contacto({ nombre, correo, mensaje });
        await nuevoMensaje.save();

        res.json({ mensaje: '¡Gracias por escribirnos! Tu mensaje fue guardado.' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al enviar el mensaje de contacto.' });
    }
});

// Ver todos los mensajes de contacto en el Dashboard
app.get('/api/contacto', async (req, res) => {
    try {
        const mensajes = await Contacto.find().sort({ fecha: -1 });
        res.json(mensajes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los mensajes.' });
    }
});

// Iniciar el servidor
app.listen(PUERTO, () => {
    console.log('Servidor corriendo en http://localhost:' + PUERTO);
});

