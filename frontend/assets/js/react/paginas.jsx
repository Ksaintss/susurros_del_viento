// ===================== INICIO =====================
function PaginaInicio() {
  return (
    <>
      {/* Banner principal estilo tienda Gef */}
      <section className="banner-principal">
        <div className="banner-texto">
          <span className="banner-etiqueta">Nueva Colección Hecha a Mano</span>
          <h1>Arte propio inspirado en el mundo de Studio Ghibli</h1>
          <p>
            Piezas únicas tejidas en crochet, cerámica esmaltada, madera tallada y resina creadas paso a paso en nuestro taller.
          </p>
          <Enlace a="/catalogo" className="boton-principal">Ver colección completa</Enlace>
        </div>
        <div className="banner-imagen">
          <img src="assets/img/taller.png" alt="Colección Artesanal Studio Ghibli" />
        </div>
      </section>

      {/* Productos destacados */}
      <section className="contenedor-seccion">
        <div className="titulo-seccion">
          <h2>Productos Destacados</h2>
          <p>Nuestras piezas artesanales más pedidas por los fans de Totoro, Calcifer y Chihiro</p>
        </div>

        <div className="contenedor-productos">
          {productosDestacados.map((producto) => (
            <TarjetaProducto key={producto.nombre} producto={producto} />
          ))}
        </div>
      </section>

      {/* Segundo banner hacia Conócenos */}
      <section className="banner-secundario">
        <div className="banner-imagen">
          <img src="assets/img/taller3.jpg" alt="Taller Artesanal Ghibli" />
        </div>
        <div className="banner-texto">
          <span className="banner-etiqueta">100% Hecho a Mano</span>
          <h1>Cada pieza cuenta una historia</h1>
          <p>
            No trabajamos con productos industriales en serie. Conoce la historia de nuestro taller artesanal, nuestra Misión y nuestra Visión.
          </p>
          <Enlace a="/conocenos" className="boton-principal">Conoce nuestra Misión y Visión</Enlace>
        </div>
      </section>
    </>
  );
}

// ===================== CONOCENOS =====================
function PaginaConocenos() {
  return (
    <main className="contenedor-seccion">
      <div className="titulo-seccion">
        <h2>Conócenos</h2>
        <p>Conoce la historia, misión y visión de nuestro taller artesanal inspirado en Studio Ghibli</p>
      </div>

      <section className="banner-secundario" style={{ marginTop: '10px' }}>
        <div className="banner-imagen">
          <img src="assets/img/taller3.jpg" alt="Nuestro Taller Artesanal Bosque Ghibli" />
        </div>
        <div className="banner-texto">
          <span className="banner-etiqueta">Nuestra Historia</span>
          <h1>Arte hecho con calma y dedicación</h1>
          <p>
            <strong>Bosque Ghibli</strong> nació como un proyecto universitario impulsado por el gusto hacia la ilustración, las manualidades y las películas de Studio Ghibli. Cada tejido en crochet, pieza de cerámica y escultura en madera o resina es creada a mano paso a paso en nuestro pequeño taller.
          </p>
          <Enlace a="/catalogo" className="boton-principal">Explorar nuestras creaciones</Enlace>
        </div>
      </section>

      <section className="mision-vision" style={{ width: '100%', margin: '35px auto' }}>
        <div className="caja-mision">
          <h3>Nuestra Misión</h3>
          <p>
            En <strong>Bosque Ghibli</strong> nuestra misión es crear piezas de arte propio y productos artesanales hechos completamente a mano que transmitan la calma, la magia y el amor por la naturaleza presentes en las películas de Studio Ghibli. Buscamos ofrecer objetos únicos y duraderos —como tejidos en crochet, cerámica e ilustración— elaborados con materiales locales y mucho cariño para acompañar el día a día de las personas.
          </p>
        </div>

        <div className="caja-mision">
          <h3>Nuestra Visión</h3>
          <p>
            Para los próximos años, proyectamos consolidarnos como un emprendimiento creativo referente a nivel nacional en el diseño de artesanías e ilustraciones inspiradas en la animación japonesa, apoyando el trabajo manual de jóvenes artistas y manteniendo siempre una producción responsable, cercana al cliente y libre de procesos industriales masivos.
          </p>
        </div>
      </section>
    </main>
  );
}

// ===================== CATALOGO =====================
const FILTROS_PERSONAJES = ['Todos', 'Totoro', 'Calcifer', 'Sin Cara', 'Mononoke', 'Ponyo', 'Kiki'];

// Mezcla los productos del backend con los destacados del Inicio
// (si ya existen por nombre, solo se actualiza su imagen)
function combinarProductos(catalogo, destacados) {
  const lista = catalogo.map((producto) => ({ ...producto }));

  destacados.forEach((destacado) => {
    const indice = lista.findIndex(
      (producto) => producto.nombre.toLowerCase() === destacado.nombre.toLowerCase()
    );

    if (indice === -1) {
      lista.push(destacado);
    } else {
      lista[indice].imagen = destacado.imagen;
    }
  });

  return lista;
}

function PaginaCatalogo() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState('Todos');

  useEffect(() => {
    let activo = true;

    fetch(URL_API + '/productos')
      .then((respuesta) => respuesta.json())
      .then((datos) => (Array.isArray(datos) && datos.length > 0 ? datos : productosBase))
      // Si el backend no está prendido, mostramos los productos base
      .catch(() => productosBase)
      .then((lista) => {
        if (activo) {
          setProductos(combinarProductos(lista, productosDestacados));
        }
      });

    return () => {
      activo = false;
    };
  }, []);

  const visibles =
    filtro === 'Todos'
      ? productos
      : productos.filter((p) => p.personaje.toLowerCase() === filtro.toLowerCase());

  return (
    <main className="contenedor-seccion">
      <div className="titulo-seccion">
        <h2>Catálogo de Productos Artesanales</h2>
        <p>Explora todas nuestras creaciones hechas a mano inspiradas en tus personajes favoritos</p>
      </div>

      <div className="barra-filtros">
        {FILTROS_PERSONAJES.map((personaje) => (
          <button
            key={personaje}
            className={'boton-filtro' + (filtro === personaje ? ' activo' : '')}
            onClick={() => setFiltro(personaje)}
          >
            {personaje}
          </button>
        ))}
      </div>

      <div className="contenedor-productos">
        {visibles.map((producto) => (
          <TarjetaProducto key={producto._id || producto.nombre} producto={producto} />
        ))}
      </div>
    </main>
  );
}

// ===================== CARRITO =====================
function PaginaCarrito() {
  const { carrito, total, quitar, vaciar } = useCarrito();

  function finalizarCompra() {
    if (carrito.length === 0) {
      alert('Agrega al menos un producto artesanal antes de realizar la compra.');
      return;
    }

    alert('¡Muchas gracias por apoyar nuestro emprendimiento artesanal! Tu pedido está en preparación.');
    vaciar();
  }

  return (
    <main className="contenedor-seccion">
      <div className="titulo-seccion">
        <h2>Tu Carrito de Compras</h2>
        <p>Revisa tus productos artesanales seleccionados antes de confirmar tu pedido</p>
      </div>

      <div className="contenedor-carrito">
        <table className="tabla-carrito">
          <thead>
            <tr>
              <th>Imagen y producto</th>
              <th>Personaje</th>
              <th>Precio</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {carrito.length === 0 ? (
              <tr>
                <td colSpan="4">Tu carrito está vacío por ahora. ¡Explora el catálogo!</td>
              </tr>
            ) : (
              carrito.map((item, indice) => (
                <tr key={indice}>
                  <td data-label="Producto">
                    <div className="producto-carrito">
                      {item.imagen && <img src={rutaImagen(item.imagen)} alt={item.nombre} />}
                      <span>{item.nombre}</span>
                    </div>
                  </td>
                  <td data-label="Personaje">{item.personaje}</td>
                  <td data-label="Precio">{formatoCOP(item.precio)}</td>
                  <td data-label="Acción">
                    <button className="boton-eliminar" onClick={() => quitar(indice)}>
                      Quitar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="resumen-carrito">
          <div>
            <span>Total a pagar: </span>
            <span className="total-pagar">{formatoCOP(total)}</span>
          </div>
          <div>
            <button className="boton-eliminar" onClick={vaciar}>Vaciar carrito</button>
            <button className="boton-principal" onClick={finalizarCompra}>Comprar ahora</button>
          </div>
        </div>
      </div>
    </main>
  );
}

// ===================== CONTACTO =====================
const vacio = { nombre: '', correo: '', mensaje: '' };

function PaginaContacto() {
  const [form, setForm] = useState(vacio);
  const [estado, setEstado] = useState('');

  function cambiar(evento) {
    setForm({ ...form, [evento.target.name]: evento.target.value });
  }

  async function enviar(evento) {
    evento.preventDefault();

    try {
      const respuesta = await fetch(URL_API + '/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const datos = await respuesta.json();

      setEstado(datos.mensaje);
      if (respuesta.ok) {
        setForm(vacio);
      }
    } catch (error) {
      setEstado(mensajeDeError(error));
    }
  }

  return (
    <main className="contenedor-seccion">
      <div className="titulo-seccion">
        <h2>Contáctanos</h2>
        <p>¿Quieres un pedido personalizado de tu personaje favorito de Studio Ghibli? Escríbenos</p>
      </div>

      <div
        className="caja-mision"
        style={{ maxWidth: '520px', margin: '0 auto 28px auto', textAlign: 'center' }}
      >
        <h3>Nuestras Redes y Enlaces</h3>
        <p style={{ marginBottom: '16px' }}>
          Encuéntranos también en nuestras redes sociales y canales directos a través de nuestro Linktree oficial:
        </p>
        <a
          href="https://linktr.ee/Susurrosdelviento"
          target="_blank"
          rel="noopener noreferrer"
          className="boton-principal"
        >
          Visitar Linktree (@Susurrosdelviento)
        </a>
      </div>

      <form className="formulario" onSubmit={enviar}>
        <h3>Enviar Mensaje al Taller</h3>

        <div className="grupo-campo">
          <label htmlFor="contacto-nombre">Nombre completo</label>
          <input
            type="text"
            id="contacto-nombre"
            name="nombre"
            placeholder="Ej: Sofía Ramírez"
            value={form.nombre}
            onChange={cambiar}
            required
          />
        </div>

        <div className="grupo-campo">
          <label htmlFor="contacto-correo">Correo electrónico</label>
          <input
            type="email"
            id="contacto-correo"
            name="correo"
            placeholder="sofia@correo.com"
            value={form.correo}
            onChange={cambiar}
            required
          />
        </div>

        <div className="grupo-campo">
          <label htmlFor="contacto-mensaje">Mensaje o descripción de tu pedido</label>
          <textarea
            id="contacto-mensaje"
            name="mensaje"
            placeholder="Cuéntanos qué personaje o artesanía te gustaría..."
            value={form.mensaje}
            onChange={cambiar}
            required
          />
        </div>

        <button type="submit" className="boton-principal">Enviar Mensaje</button>
        <p className="mensaje-estado">{estado}</p>
      </form>
    </main>
  );
}

// ===================== LOGIN =====================
async function enviarJSON(ruta, cuerpo, mensajeFallo) {
  const respuesta = await fetch(URL_API + ruta, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo)
  });
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || mensajeFallo);
  }

  return datos;
}

function PaginaLogin() {
  const { iniciarSesion } = useSesion();

  const [login, setLogin] = useState({ correo: '', password: '' });
  const [estadoLogin, setEstadoLogin] = useState('');

  const [registro, setRegistro] = useState({ nombre: '', correo: '', password: '' });
  const [estadoRegistro, setEstadoRegistro] = useState('');

  async function manejarLogin(evento) {
    evento.preventDefault();

    try {
      const datos = await enviarJSON('/api/login', login, 'No se pudo iniciar sesión.');

      setEstadoLogin(datos.mensaje);
      iniciarSesion(datos.usuario, datos.token);

      setTimeout(() => {
        irA(datos.usuario.rol === 'admin' ? '/dashboard' : '/');
      }, 1000);
    } catch (error) {
      setEstadoLogin(mensajeDeError(error));
    }
  }

  async function manejarRegistro(evento) {
    evento.preventDefault();

    try {
      const datos = await enviarJSON('/api/registro', registro, 'No se pudo registrar.');

      setEstadoRegistro(datos.mensaje);
      setRegistro({ nombre: '', correo: '', password: '' });
    } catch (error) {
      setEstadoRegistro(mensajeDeError(error));
    }
  }

  return (
    <main className="contenedor-seccion">
      <div className="titulo-seccion">
        <h2>Acceso de Usuarios</h2>
        <p>Inicia sesión en tu cuenta o regístrate para gestionar tus pedidos.</p>
      </div>

      <div className="contenedor-doble">
        {/* Formulario de Login */}
        <form className="formulario" onSubmit={manejarLogin}>
          <h3>Iniciar Sesión</h3>

          <div className="grupo-campo">
            <label htmlFor="login-correo">Correo electrónico</label>
            <input
              type="email"
              id="login-correo"
              placeholder="usuario@correo.com"
              value={login.correo}
              onChange={(e) => setLogin({ ...login, correo: e.target.value })}
              required
            />
          </div>

          <div className="grupo-campo">
            <label htmlFor="login-password">Contraseña</label>
            <input
              type="password"
              id="login-password"
              placeholder="Ingresa tu contraseña"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="boton-principal">Ingresar</button>
          <p className="mensaje-estado">{estadoLogin}</p>
        </form>

        {/* Formulario de Registro */}
        <form className="formulario" onSubmit={manejarRegistro}>
          <h3>Crear Cuenta Nueva</h3>

          <div className="grupo-campo">
            <label htmlFor="registro-nombre">Nombre completo</label>
            <input
              type="text"
              id="registro-nombre"
              placeholder="Ej: Mateo Gómez"
              value={registro.nombre}
              onChange={(e) => setRegistro({ ...registro, nombre: e.target.value })}
              required
            />
          </div>

          <div className="grupo-campo">
            <label htmlFor="registro-correo">Correo electrónico</label>
            <input
              type="email"
              id="registro-correo"
              placeholder="mateo@correo.com"
              value={registro.correo}
              onChange={(e) => setRegistro({ ...registro, correo: e.target.value })}
              required
            />
          </div>

          <div className="grupo-campo">
            <label htmlFor="registro-password">Contraseña</label>
            <input
              type="password"
              id="registro-password"
              placeholder="Crea una contraseña"
              value={registro.password}
              onChange={(e) => setRegistro({ ...registro, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="boton-principal">Registrarse</button>
          <p className="mensaje-estado">{estadoRegistro}</p>
        </form>
      </div>
    </main>
  );
}

// ===================== DASHBOARD =====================
const PERSONAJES_FORM = ['Totoro', 'Calcifer', 'Sin Cara', 'Mononoke', 'Ponyo', 'Kiki'];

const formularioVacio = {
  nombre: '',
  personaje: 'Totoro',
  precio: '',
  imagen: 'assets/img/Totoro.jpg',
  descripcion: ''
};

function PaginaDashboard() {
  const { token, cerrarSesion } = useSesion();

  const [productos, setProductos] = useState([]);
  const [errorProductos, setErrorProductos] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [errorMensajes, setErrorMensajes] = useState(false);
  const [form, setForm] = useState(formularioVacio);
  const [estado, setEstado] = useState('');

  const cargarDatos = useCallback(async () => {
    try {
      const respuesta = await fetch(URL_API + '/productos');
      const datos = await respuesta.json();
      setProductos(Array.isArray(datos) ? datos : []);
      setErrorProductos(false);
    } catch {
      setErrorProductos(true);
    }

    try {
      const respuesta = await fetch(URL_API + '/contacto', {
        headers: cabecerasConToken(token)
      });

      // Token vencido o inválido: se cierra la sesión y RequireAdmin redirige al login
      if (respuesta.status === 401 || respuesta.status === 403) {
        cerrarSesion();
        return;
      }

      const datos = await respuesta.json();
      setMensajes(Array.isArray(datos) ? datos : []);
      setErrorMensajes(false);
    } catch {
      setErrorMensajes(true);
    }
  }, [token, cerrarSesion]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  function cambiar(evento) {
    setForm({ ...form, [evento.target.name]: evento.target.value });
  }

  async function guardarProducto(evento) {
    evento.preventDefault();

    try {
      const respuesta = await fetch(URL_API + '/productos', {
        method: 'POST',
        headers: cabecerasConToken(token),
        body: JSON.stringify({ ...form, precio: Number(form.precio) })
      });
      const datos = await respuesta.json();

      setEstado(datos.mensaje);
      if (respuesta.ok) {
        setForm(formularioVacio);
        cargarDatos();
      }
    } catch {
      setEstado('Error: verifica que el backend esté encendido en el puerto 3000.');
    }
  }

  async function eliminarProducto(id) {
    try {
      await fetch(URL_API + '/productos/' + id, {
        method: 'DELETE',
        headers: cabecerasConToken(token)
      });
    } catch {
      /* si falla, la tabla se vuelve a cargar igual */
    }
    cargarDatos();
  }

  return (
    <main className="contenedor-seccion">
      <div className="titulo-seccion">
        <h2>Panel de Administración (Dashboard)</h2>
        <p>Agrega nuevos productos artesanales al catálogo o revisa los mensajes enviados por los clientes</p>
      </div>

      <div className="contenedor-doble">
        {/* Formulario para publicar un nuevo producto */}
        <form className="formulario" onSubmit={guardarProducto}>
          <h3>Agregar Producto Artesanal</h3>

          <div className="grupo-campo">
            <label htmlFor="prod-nombre">Nombre del producto</label>
            <input
              type="text"
              id="prod-nombre"
              name="nombre"
              placeholder="Ej: Cuaderno Bordado Totoro"
              value={form.nombre}
              onChange={cambiar}
              required
            />
          </div>

          <div className="grupo-campo">
            <label htmlFor="prod-personaje">Personaje de Ghibli</label>
            <select
              id="prod-personaje"
              name="personaje"
              value={form.personaje}
              onChange={cambiar}
              required
            >
              {PERSONAJES_FORM.map((personaje) => (
                <option key={personaje} value={personaje}>{personaje}</option>
              ))}
            </select>
          </div>

          <div className="grupo-campo">
            <label htmlFor="prod-precio">Precio (COP)</label>
            <input
              type="number"
              id="prod-precio"
              name="precio"
              placeholder="Ej: 55000"
              value={form.precio}
              onChange={cambiar}
              required
            />
          </div>

          <div className="grupo-campo">
            <label htmlFor="prod-imagen">Ruta de la imagen local</label>
            <input
              type="text"
              id="prod-imagen"
              name="imagen"
              value={form.imagen}
              onChange={cambiar}
              required
            />
          </div>

          <div className="grupo-campo">
            <label htmlFor="prod-descripcion">Descripción artesanal</label>
            <textarea
              id="prod-descripcion"
              name="descripcion"
              placeholder="Describe cómo fue elaborado este producto..."
              value={form.descripcion}
              onChange={cambiar}
              required
            />
          </div>

          <button type="submit" className="boton-principal">Guardar Producto</button>
          <p className="mensaje-estado">{estado}</p>
        </form>

        {/* Productos y mensajes actuales */}
        <div className="contenedor-carrito panel-dashboard">
          <h3 style={{ marginBottom: '15px', textTransform: 'uppercase', fontSize: '16px' }}>
            Productos en Base de Datos
          </h3>
          <table className="tabla-carrito">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Personaje</th>
                <th>Precio</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {errorProductos ? (
                <tr>
                  <td colSpan="4">Enciende el servidor backend para administrar productos en MongoDB.</td>
                </tr>
              ) : (
                productos.map((p) => (
                  <tr key={p._id}>
                    <td data-label="Nombre">{p.nombre}</td>
                    <td data-label="Personaje">{p.personaje}</td>
                    <td data-label="Precio">{formatoCOP(p.precio)}</td>
                    <td data-label="Acción">
                      <button className="boton-eliminar" onClick={() => eliminarProducto(p._id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h3 style={{ margin: '25px 0 15px 0', textTransform: 'uppercase', fontSize: '16px' }}>
            Mensajes de Contacto Recibidos
          </h3>
          <table className="tabla-carrito">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Correo</th>
                <th>Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {errorMensajes ? (
                <tr>
                  <td colSpan="3">Enciende el servidor backend para ver los mensajes recibidos.</td>
                </tr>
              ) : mensajes.length === 0 ? (
                <tr>
                  <td colSpan="3">Aún no hay mensajes de contacto.</td>
                </tr>
              ) : (
                mensajes.map((m) => (
                  <tr key={m._id}>
                    <td data-label="Cliente">{m.nombre}</td>
                    <td data-label="Correo">{m.correo}</td>
                    <td data-label="Mensaje">{m.mensaje}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
