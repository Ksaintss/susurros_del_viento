
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Modelos de MongoDB
const Usuario = require('./models/Usuario');
const Producto = require('./models/Producto');
const Contacto = require('./models/Contacto');

const app = express();

const PUERTO = process.env.PUERTO || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Configuraciones de Express
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ==========================================
// AUTENTICACIÓN Y PERMISOS
// ==========================================

function verificarToken(req, res, next) {
    const encabezado = req.headers['authorization'];

    const token = encabezado && encabezado.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            mensaje: 'Debes iniciar sesión para continuar.'
        });
    }

    jwt.verify(token, process.env.JWT_SECRETO, (error, usuario) => {
        if (error) {
            return res.status(403).json({
                mensaje: 'Tu sesión no es válida o ha expirado.'
            });
        }

        req.usuario = usuario;
        next();
    });
}

function verificarAdmin(req, res, next) {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({
            mensaje: 'No tienes permisos de administrador.'
        });
    }

    next();
}

// ==========================================
// PRODUCTOS INICIALES
// ==========================================

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

            console.log('Productos iniciales insertados correctamente.');
        } else {
            console.log('Los productos ya existen. No se insertaron duplicados.');
        }
    } catch (error) {
        console.error('Error al cargar productos:', error.message);
        throw error;
    }
}

// ==========================================
// RUTAS DE USUARIOS
// ==========================================

// Registrar usuario
app.post('/api/registro', async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;

        if (!nombre || !correo || !password) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios.'
            });
        }

        const correoNormalizado = correo.trim().toLowerCase();

        if (password.length < 8) {
            return res.status(400).json({
                mensaje: 'La contraseña debe tener al menos 8 caracteres.'
            });
        }

        const existeUsuario = await Usuario.findOne({
            correo: correoNormalizado
        });

        if (existeUsuario) {
            return res.status(400).json({
                mensaje: 'Este correo ya está registrado.'
            });
        }

        // Encriptar la contraseña antes de guardarla
        const passwordSegura = await bcrypt.hash(password, 10);

        const nuevoUsuario = new Usuario({
            nombre: nombre.trim(),
            correo: correoNormalizado,
            password: passwordSegura
        });

        await nuevoUsuario.save();

        res.status(201).json({
            mensaje: 'Usuario registrado con éxito.',
            usuario: {
                nombre: nuevoUsuario.nombre,
                correo: nuevoUsuario.correo
            }
        });

    } catch (error) {
        console.error('Error al registrar:', error.message);

        res.status(500).json({
            mensaje: 'Error al registrar el usuario.'
        });
    }
});

// Iniciar sesión
app.post('/api/login', async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({
                mensaje: 'Debes ingresar correo y contraseña.'
            });
        }

        const correoNormalizado = correo.trim().toLowerCase();

        const usuarioEncontrado = await Usuario.findOne({
            correo: correoNormalizado
        });

        if (!usuarioEncontrado) {
            return res.status(401).json({
                mensaje: 'Correo o contraseña incorrectos.'
            });
        }

        let contraseñaCorrecta = false;

        // Detectar si la contraseña ya está protegida con bcrypt
        const esHashBcrypt = /^\$2[aby]\$/.test(usuarioEncontrado.password);

        if (esHashBcrypt) {
            contraseñaCorrecta = await bcrypt.compare(
                password,
                usuarioEncontrado.password
            );
        } else {
            // Compatibilidad con usuarios registrados antes de este cambio
            contraseñaCorrecta = password === usuarioEncontrado.password;

            // Si la contraseña antigua coincide, protegerla ahora
            if (contraseñaCorrecta) {
                usuarioEncontrado.password = await bcrypt.hash(password, 10);
                await usuarioEncontrado.save();
            }
        }

        if (!contraseñaCorrecta) {
            return res.status(401).json({
                mensaje: 'Correo o contraseña incorrectos.'
            });
        }

        
const token = jwt.sign(
    {
        id: usuarioEncontrado._id,
        correo: usuarioEncontrado.correo,
        rol: usuarioEncontrado.rol || 'usuario'
    },
    process.env.JWT_SECRETO,
    { expiresIn: '2h' }
);

res.json({
    mensaje: 'Inicio de sesión exitoso.',
    token: token,
    usuario: {
        nombre: usuarioEncontrado.nombre,
        correo: usuarioEncontrado.correo,
        rol: usuarioEncontrado.rol || 'usuario'
    }
});

    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);

        res.status(500).json({
            mensaje: 'Error en el servidor al iniciar sesión.'
        });
    }
});

// ==========================================
// RUTAS DE PRODUCTOS
// ==========================================

// Obtener productos
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            mensaje: 'Error al obtener los productos.'
        });
    }
});

// Crear producto
app.post('/api/productos', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const { nombre, descripcion, precio, imagen, personaje } = req.body;

        if (!nombre || !descripcion || !imagen || !personaje ||
            precio === undefined || Number(precio) <= 0 ||
            !Number.isFinite(Number(precio))) {
            return res.status(400).json({
                mensaje: 'Completa todos los campos con datos válidos.'
            });
        }

        const nuevoProducto = new Producto({
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            precio: Number(precio),
            imagen,
            personaje
        });

        await nuevoProducto.save();

        res.status(201).json({
            mensaje: 'Producto artesanal guardado correctamente.',
            producto: nuevoProducto
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            mensaje: 'Error al guardar el producto.'
        });
    }
});

// Eliminar producto
app.delete('/api/productos/:id', verificarToken, verificarAdmin, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                mensaje: 'El identificador del producto no es válido.'
            });
        }

        const productoEliminado = await Producto.findByIdAndDelete(
            req.params.id
        );

        if (!productoEliminado) {
            return res.status(404).json({
                mensaje: 'No se encontró el producto.'
            });
        }

        res.json({
            mensaje: 'Producto eliminado correctamente.'
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            mensaje: 'Error al eliminar el producto.'
        });
    }
});

// ==========================================
// RUTAS DE CONTACTO
// ==========================================

// Guardar mensaje
app.post('/api/contacto', async (req, res) => {
    try {
        const { nombre, correo, mensaje } = req.body;

        if (!nombre || !correo || !mensaje) {
            return res.status(400).json({
                mensaje: 'Completa todos los campos.'
            });
        }

        const nuevoMensaje = new Contacto({
            nombre: nombre.trim(),
            correo: correo.trim().toLowerCase(),
            mensaje: mensaje.trim()
        });

        await nuevoMensaje.save();

        res.status(201).json({
            mensaje: '¡Gracias por escribirnos! Tu mensaje fue guardado.'
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            mensaje: 'Error al enviar el mensaje de contacto.'
        });
    }
});

// Obtener mensajes
app.get('/api/contacto', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const mensajes = await Contacto.find().sort({ fecha: -1 });
        res.json(mensajes);
    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            mensaje: 'Error al obtener los mensajes.'
        });
    }
});

// ==========================================
// CONEXIÓN Y ENCENDIDO DEL SERVIDOR
// ==========================================

async function iniciarServidor() {
    try {
        if (!MONGO_URI) {
            throw new Error('No se encontró MONGO_URI en el archivo .env');
        }

        await mongoose.connect(MONGO_URI);

        console.log('Conectado correctamente a MongoDB.');

        await cargarProductosIniciales();

        app.listen(PUERTO, () => {
            console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
        });

    } catch (error) {
        console.error('No se pudo iniciar el servidor:', error.message);
        process.exit(1);
    }
}

iniciarServidor();
