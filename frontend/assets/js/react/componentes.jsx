function Enlace({ a, className, children }) {
  return <a href={'#' + a} className={className}>{children}</a>;
}

function Navbar({ ruta }) {
  const { usuario, cerrarSesion } = useSesion();
  const { carrito } = useCarrito();

  const activo = (destino) => (ruta === destino ? 'activo' : undefined);

  return (
    <header className="barra-navegacion">
      <Enlace a="/" className="logo-tienda">
        Susurros del Viento
        <span>Arte &amp; Hecho a Mano</span>
      </Enlace>

      <ul className="enlaces-menu">
        <li><Enlace a="/" className={activo('/')}>Inicio</Enlace></li>
        <li><Enlace a="/conocenos" className={activo('/conocenos')}>Conócenos</Enlace></li>
        <li><Enlace a="/catalogo" className={activo('/catalogo')}>Catálogo</Enlace></li>
        <li>
          <Enlace a="/carrito" className={activo('/carrito')}>
            Carrito <span className="contador-carrito">{carrito.length}</span>
          </Enlace>
        </li>
        <li><Enlace a="/contacto" className={activo('/contacto')}>Contacto</Enlace></li>

        {!usuario && (
          <li><Enlace a="/login" className={activo('/login')}>Login</Enlace></li>
        )}

        {usuario && usuario.rol === 'admin' && (
          <li><Enlace a="/dashboard" className={activo('/dashboard')}>Dashboard</Enlace></li>
        )}

        {usuario && (
          <li>
            <a href="#/login" className="enlace-cerrar-sesion" onClick={cerrarSesion}>
              Cerrar sesión
            </a>
          </li>
        )}
      </ul>
    </header>
  );
}

function Footer() {
  return (
    <footer className="pie-pagina">
      <p>
        &copy; 2026 Susurros del viento - Emprendimiento de Arte y Productos Artesanales. Jovenes Creativos.
      </p>
    </footer>
  );
}

function TarjetaProducto({ producto }) {
  const { agregar } = useCarrito();

  function manejarAgregar() {
    agregar(producto);
    alert('Producto agregado al carrito: ' + producto.nombre);
  }

  return (
    <div className="tarjeta-producto">
      <img src={rutaImagen(producto.imagen)} alt={producto.nombre} />
      <div className="info-producto">
        <div>
          <p className="etiqueta-personaje">{producto.personaje}</p>
          <h3>{producto.nombre}</h3>
          <p>{producto.descripcion}</p>
        </div>
        <div>
          <p className="precio-producto">{formatoCOP(producto.precio)}</p>
          <button className="boton-agregar" onClick={manejarAgregar}>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
