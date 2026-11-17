// =======================================================
// ARCHIVO PRINCIPAL DE JAVASCRIPT (main.js)
// =======================================================

const URL_API = 'https://backend-susurrosdelviento.onrender.com';

// Rutas: este script lo cargan index.html (raíz) y las páginas de assets/pages/
const EN_PAGINAS = window.location.pathname.indexOf('/assets/pages/') !== -1;
const RAIZ = EN_PAGINAS ? '../../' : '';
const PAGINAS = EN_PAGINAS ? '' : 'assets/pages/';

// Las imágenes se guardan con ruta desde la raíz (ej: assets/img/Totoro.jpg)
function rutaImagen(ruta) {
    if (/^(https?:|data:|\/)/.test(ruta)) {
        return ruta;
    }
    return RAIZ + ruta;
}
function actualizarMenuSesion() {
    const usuario = JSON.parse(localStorage.getItem('usuarioGhibli') || 'null');
    const enlacesMenu = document.querySelectorAll('.enlaces-menu');

    enlacesMenu.forEach(function (menu) {
        const enlaceLogin = menu.querySelector('a[href$="Login.html"]');
        const enlaceDashboard = menu.querySelector('a[href$="Dashboard.html"]');

        if (enlaceLogin) {
            enlaceLogin.parentElement.style.display = usuario ? 'none' : '';
        }

        if (enlaceDashboard) {
            enlaceDashboard.parentElement.style.display =
                usuario && usuario.rol === 'admin' ? '' : 'none';
        }
        if (usuario) {
    let enlaceCerrar = menu.querySelector('.enlace-cerrar-sesion');

    if (!enlaceCerrar) {
        const nuevoElemento = document.createElement('li');
        enlaceCerrar = document.createElement('a');

        enlaceCerrar.href = '#';
        enlaceCerrar.className = 'enlace-cerrar-sesion';
        enlaceCerrar.textContent = 'Cerrar sesión';

        enlaceCerrar.addEventListener('click', function (evento) {
            evento.preventDefault();

            localStorage.removeItem('usuarioGhibli');
            localStorage.removeItem('tokenGhibli');

            window.location.href = PAGINAS + 'Login.html';
        });

        nuevoElemento.appendChild(enlaceCerrar);
        menu.appendChild(nuevoElemento);
    }
}
    });
}
actualizarMenuSesion();
// Lista de productos base por si el servidor aún no está encendido
const productosBase = [
    {
        _id: '1',
        nombre: 'Amigurumi Totoro Guardián del Bosque',
        descripcion: 'Muñeco tejido a mano en crochet con hilo de algodón hipoalergénico y hojita bordada.',
        precio: 65000,
        imagen: 'assets/img/Totoro.jpg',
        personaje: 'Totoro'
    },
    {
        _id: '2',
        nombre: 'Lámpara Artesanal Calcifer en Resina',
        descripcion: 'Pequeña lámpara de escritorio moldeada y pintada a mano con luz cálida tipo fogata.',
        precio: 85000,
        imagen: 'assets/img/Calcifer.jpg',
        personaje: 'Calcifer'
    },
    {
        _id: '3',
        nombre: 'Taza de Cerámica Sin Cara (Kaonashi)',
        descripcion: 'Taza torneada en arcilla y esmaltada a mano en horno artesanal, capacidad de 350 ml.',
        precio: 48000,
        imagen: 'assets/img/SinCara.jpg',
        personaje: 'Sin Cara'
    },
    {
        _id: '4',
        nombre: 'Máscara Decorativa Princesa Mononoke',
        descripcion: 'Escultura de pared tallada en madera liviana y pintada con acrílicos mates.',
        precio: 92000,
        imagen: 'assets/img/Mononoke.jpg',
        personaje: 'Mononoke'
    },
    {
        _id: '5',
        nombre: 'Terrario de Cristal Ponyo en el Mar',
        descripcion: 'Mini escenario hecho a mano con figuras en porcelana fría y piedras naturales.',
        precio: 58000,
        imagen: 'assets/img/ponyoterrario.png',
        personaje: 'Ponyo'
    },
    {
        _id: '6',
        nombre: 'Tote Bag Bordada Jiji y Kiki',
        descripcion: 'Bolso de lienzo crudo 100% algodón con bordado artesanal hecho puntada a puntada.',
        precio: 42000,
        imagen: 'assets/img/kiki&jiji.png',
        personaje: 'Kiki'
    }
];

// Variable global para guardar los productos cargados en el catálogo
let listaProductos = [];

// =======================================================
// FUNCIONES DEL CARRITO DE COMPRAS (CON LOCALSTORAGE)
// =======================================================

function obtenerCarrito() {
    const carritoGuardado = localStorage.getItem('carritoGhibli');
    if (carritoGuardado) {
        return JSON.parse(carritoGuardado);
    }
    return [];
}

function guardarCarrito(carrito) {
    localStorage.setItem('carritoGhibli', JSON.stringify(carrito));
    actualizarContadorMenu();
}

function actualizarContadorMenu() {
    const elementoContador = document.getElementById('contador-carrito');
    if (elementoContador) {
        const carrito = obtenerCarrito();
        elementoContador.innerHTML = carrito.length;
    }
}

function agregarAlCarrito(nombre, precio, personaje, imagen) {
    const carrito = obtenerCarrito();
    carrito.push({
        nombre: nombre,
        precio: Number(precio),
        personaje: personaje,
        imagen: imagen
    });
    guardarCarrito(carrito);
    alert('Producto agregado al carrito: ' + nombre);
}

function mostrarCarrito() {
    const tablaCuerpo = document.getElementById('cuerpo-tabla-carrito');
    const textoTotal = document.getElementById('total-carrito');

    if (!tablaCuerpo || !textoTotal) {
        return;
    }

    const carrito = obtenerCarrito();
    tablaCuerpo.innerHTML = '';
    let sumaTotal = 0;

    if (carrito.length === 0) {
        tablaCuerpo.innerHTML = '<tr><td colspan="4">Tu carrito está vacío por ahora. ¡Explora el catálogo!</td></tr>';
        textoTotal.innerHTML = '$0 COP';
        return;
    }

    for (let i = 0; i < carrito.length; i++) {
        const item = carrito[i];
        sumaTotal = sumaTotal + item.precio;

        tablaCuerpo.innerHTML += `
            <tr>
                    <td>
                        <div class="producto-carrito">
                            ${item.imagen ? `<img src="${rutaImagen(item.imagen)}" alt="${item.nombre}">` : ''}
                            <span>${item.nombre}</span>
                        </div>
                    </td>
                <td>${item.personaje}</td>
                <td>$${item.precio.toLocaleString('es-CO')} COP</td>
                <td>
                    <button class="boton-eliminar" onclick="eliminarDelCarrito(${i})">Quitar</button>
                </td>
            </tr>
        `;
    }

    textoTotal.innerHTML = '$' + sumaTotal.toLocaleString('es-CO') + ' COP';
}

function eliminarDelCarrito(indice) {
    const carrito = obtenerCarrito();
    carrito.splice(indice, 1);
    guardarCarrito(carrito);
    mostrarCarrito();
}

function vaciarCarrito() {
    localStorage.removeItem('carritoGhibli');
    actualizarContadorMenu();
    mostrarCarrito();
}

function finalizarCompra() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        alert('Agrega al menos un producto artesanal antes de realizar la compra.');
        return;
    }

    alert('¡Muchas gracias por apoyar nuestro emprendimiento artesanal! Tu pedido está en preparación.');
    vaciarCarrito();
}

// =======================================================
// FUNCIONES DE PRODUCTOS (CATÁLOGO E INICIO)
// =======================================================

function cargarProductosCatalogo() {
    const contenedor = document.getElementById('contenedor-catalogo');
    if (!contenedor) {
        return;
    }

    const productosCatalogo = fetch(URL_API + '/productos')
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (datos) {
            return Array.isArray(datos) && datos.length > 0 ? datos : productosBase;
        })
        .catch(function () {
            // Si el backend no está prendido, mostramos los productos base
            return productosBase;
        });

    const productosInicio = fetch(RAIZ + 'index.html')
        .then(function (respuesta) {
            if (!respuesta.ok) {
                throw new Error('No se pudo cargar index.html.');
            }
            return respuesta.text();
        })
        .then(leerProductosInicio)
        .catch(function (error) {
            console.error('No se pudieron cargar las imágenes de Inicio en el catálogo:', error);
            return [];
        });

    Promise.all([productosCatalogo, productosInicio]).then(function (resultados) {
        listaProductos = combinarProductosCatalogo(resultados[0], resultados[1]);
        dibujarTarjetasProductos(listaProductos, 'contenedor-catalogo');
    });
}

function leerProductosInicio(html) {
    const documento = new DOMParser().parseFromString(html, 'text/html');
    const tarjetas = documento.querySelectorAll('.contenedor-seccion .contenedor-productos .tarjeta-producto');
    const productos = [];

    for (let i = 0; i < tarjetas.length; i++) {
        const tarjeta = tarjetas[i];
        const imagen = tarjeta.querySelector('img');
        const nombre = tarjeta.querySelector('.info-producto h3');
        const personaje = tarjeta.querySelector('.etiqueta-personaje');
        const descripcion = tarjeta.querySelector('.info-producto > div:first-child > p:not(.etiqueta-personaje)');
        const precio = tarjeta.querySelector('.precio-producto');

        if (!imagen || !nombre || !personaje || !descripcion || !precio) {
            console.warn('Se omitió una tarjeta de Inicio porque le faltan datos de producto.');
            continue;
        }

        productos.push({
            nombre: nombre.textContent.trim(),
            personaje: personaje.textContent.trim(),
            descripcion: descripcion.textContent.trim(),
            precio: Number(precio.textContent.replace(/[^\d]/g, '')),
            imagen: imagen.getAttribute('src')
        });
    }

    return productos;
}

function combinarProductosCatalogo(productosCatalogo, productosInicio) {
    const productos = productosCatalogo.slice();

    for (let i = 0; i < productosInicio.length; i++) {
        const productoInicio = productosInicio[i];
        const nombreInicio = productoInicio.nombre.toLowerCase();
        const indiceExistente = productos.findIndex(function (producto) {
            return producto.nombre.toLowerCase() === nombreInicio;
        });

        if (indiceExistente === -1) {
            productos.push(productoInicio);
        } else {
            productos[indiceExistente].imagen = productoInicio.imagen;
        }
    }

    return productos;
}

function dibujarTarjetasProductos(productos, idContenedor) {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = '';

    for (let i = 0; i < productos.length; i++) {
        const prod = productos[i];
        contenedor.innerHTML += `
            <div class="tarjeta-producto">
                <img src="${rutaImagen(prod.imagen)}" alt="${prod.nombre}">
                <div class="info-producto">
                    <div>
                        <p class="etiqueta-personaje">${prod.personaje}</p>
                        <h3>${prod.nombre}</h3>
                        <p>${prod.descripcion}</p>
                    </div>
                    <div>
                        <p class="precio-producto">$${Number(prod.precio).toLocaleString('es-CO')} COP</p>
                        <button class="boton-agregar" onclick="agregarAlCarrito('${prod.nombre}', ${prod.precio}, '${prod.personaje}', '${prod.imagen}')">
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

function filtrarPorPersonaje(personaje, botonPresionado) {
    const botones = document.getElementsByClassName('boton-filtro');
    for (let i = 0; i < botones.length; i++) {
        botones[i].classList.remove('activo');
    }
    if (botonPresionado) {
        botonPresionado.classList.add('activo');
    }

    if (personaje === 'Todos') {
        dibujarTarjetasProductos(listaProductos, 'contenedor-catalogo');
        return;
    }

    const filtrados = [];
    for (let i = 0; i < listaProductos.length; i++) {
        if (listaProductos[i].personaje.toLowerCase() === personaje.toLowerCase()) {
            filtrados.push(listaProductos[i]);
        }
    }
    dibujarTarjetasProductos(filtrados, 'contenedor-catalogo');
}

// =======================================================
// FUNCIONES DE CONTACTO (Contacto.html)
// =======================================================

function enviarFormularioContacto(evento) {
    evento.preventDefault();

    const nombre = document.getElementById('contacto-nombre').value;
    const correo = document.getElementById('contacto-correo').value;
    const mensaje = document.getElementById('contacto-mensaje').value;
    const estado = document.getElementById('estado-contacto');

    fetch(URL_API + '/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre, correo: correo, mensaje: mensaje })
    })
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (datos) {
            estado.innerHTML = datos.mensaje;
            document.getElementById('form-contacto').reset();
        })
        .catch(function () {
            estado.innerHTML = 'No se pudo conectar con el servidor (verifica que node server.js esté corriendo).';
        });
}

// =======================================================
// FUNCIONES DE LOGIN Y REGISTRO (Login.html)
// =======================================================


function iniciarSesion(evento) {
    evento.preventDefault();

    const correo = document.getElementById('login-correo').value;
    const password = document.getElementById('login-password').value;
    const estado = document.getElementById('estado-login');

    fetch(URL_API + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
    })
        .then(async function (respuesta) {
            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'No se pudo iniciar sesión.');
            }

            return datos;
        })
        .then(function (datos) {
            estado.textContent = datos.mensaje;

            localStorage.setItem(
                'usuarioGhibli',
                JSON.stringify(datos.usuario)
            );
localStorage.setItem('tokenGhibli', datos.token);
            setTimeout(function () {
    if (datos.usuario.rol === 'admin') {
        window.location.href = PAGINAS + 'Dashboard.html';
    } else {
        window.location.href = RAIZ + 'index.html';
    }
}, 1000);
        })
        .catch(function (error) {
            estado.textContent = error.message;
        });
}



function registrarUsuario(evento) {
    evento.preventDefault();

    const nombre = document.getElementById('registro-nombre').value;
    const correo = document.getElementById('registro-correo').value;
    const password = document.getElementById('registro-password').value;
    const estado = document.getElementById('estado-registro');

    fetch(URL_API + '/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, password })
    })
        .then(async function (respuesta) {
            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'No se pudo registrar.');
            }

            return datos;
        })
        .then(function (datos) {
            estado.textContent = datos.mensaje;
            document.getElementById('form-registro').reset();
        })
        .catch(function (error) {
            estado.textContent = error.message;
        });
}

// =======================================================
// FUNCIONES DEL PANEL DASHBOARD (Dashboard.html)
// =======================================================

function guardarProductoDashboard(evento) {
    evento.preventDefault();

    const nombre = document.getElementById('prod-nombre').value;
    const personaje = document.getElementById('prod-personaje').value;
    const precio = document.getElementById('prod-precio').value;
    const imagen = document.getElementById('prod-imagen').value;
    const descripcion = document.getElementById('prod-descripcion').value;
    const estado = document.getElementById('estado-dashboard');

    fetch(URL_API + '/productos', {
        method: 'POST',
        headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('tokenGhibli')
},
        body: JSON.stringify({
            nombre: nombre,
            personaje: personaje,
            precio: Number(precio),
            imagen: imagen,
            descripcion: descripcion
        })
    })
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (datos) {
            estado.innerHTML = datos.mensaje;
            document.getElementById('form-producto').reset();
            cargarDatosDashboard();
        })
        .catch(function () {
            estado.innerHTML = 'Error: verifica que el backend esté encendido en el puerto 3000.';
        });
}

function cargarDatosDashboard() {
    const usuario = JSON.parse(localStorage.getItem('usuarioGhibli') || '{}');
    const panelAdmin = document.getElementById('panel-administrador');

    if (panelAdmin && (usuario.rol !== 'admin' || !localStorage.getItem('tokenGhibli'))) {
    window.location.replace(PAGINAS + 'Login.html');
    return;
}

    const tablaProductos = document.getElementById('tabla-productos-dashboard');
    const tablaMensajes = document.getElementById('tabla-mensajes-dashboard');

    if (tablaProductos) {
        fetch(URL_API + '/productos')
            .then(function (res) { return res.json(); })
            .then(function (productos) {
                tablaProductos.innerHTML = '';
                for (let i = 0; i < productos.length; i++) {
                    const p = productos[i];
                    tablaProductos.innerHTML += `
                        <tr>
                            <td>${p.nombre}</td>
                            <td>${p.personaje}</td>
                            <td>$${Number(p.precio).toLocaleString('es-CO')} COP</td>
                            <td>
                                <button class="boton-eliminar" onclick="eliminarProductoBackend('${p._id}')">Eliminar</button>
                            </td>
                        </tr>
                    `;
                }
            })
            .catch(function () {
                tablaProductos.innerHTML = '<tr><td colspan="4">Enciende el servidor backend para administrar productos en MongoDB.</td></tr>';
            });
    }

    if (tablaMensajes) {
        fetch(URL_API + '/contacto', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('tokenGhibli')
            }
        })
            .then(function (res) { return res.json(); })
            .then(function (mensajes) {
                tablaMensajes.innerHTML = '';
                if (mensajes.length === 0) {
                    tablaMensajes.innerHTML = '<tr><td colspan="3">Aún no hay mensajes de contacto.</td></tr>';
                    return;
                }
                for (let i = 0; i < mensajes.length; i++) {
                    const m = mensajes[i];
                    tablaMensajes.innerHTML += `
                        <tr>
                            <td>${m.nombre}</td>
                            <td>${m.correo}</td>
                            <td>${m.mensaje}</td>
                        </tr>
                    `;
                }
            })
            .catch(function () {
                tablaMensajes.innerHTML = '<tr><td colspan="3">Enciende el servidor backend para ver los mensajes recibidos.</td></tr>';
            });
    }
}
function eliminarProductoBackend(id) {
   fetch(URL_API + '/productos/' + id, {
    method: 'DELETE',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('tokenGhibli')
    }
})
        .then(function (res) { return res.json(); })
        .then(function () {
            cargarDatosDashboard();
        });
}

// =======================================================
// INICIALIZACIÓN AL CARGAR CUALQUIER PÁGINA
// =======================================================

window.onload = function () {
    actualizarContadorMenu();
    cargarProductosCatalogo();
    mostrarCarrito();
    cargarDatosDashboard();
};

