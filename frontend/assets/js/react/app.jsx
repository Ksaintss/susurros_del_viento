// Solo deja ver el Dashboard a un administrador con sesión activa
function DashboardProtegido() {
  const { esAdmin } = useSesion();

  useEffect(() => {
    if (!esAdmin) {
      irA('/login');
    }
  }, [esAdmin]);

  return esAdmin ? <PaginaDashboard /> : null;
}

function Rutas({ ruta }) {
  switch (ruta) {
    case '/conocenos': return <PaginaConocenos />;
    case '/catalogo': return <PaginaCatalogo />;
    case '/carrito': return <PaginaCarrito />;
    case '/contacto': return <PaginaContacto />;
    case '/login': return <PaginaLogin />;
    case '/dashboard': return <DashboardProtegido />;
    default: return <PaginaInicio />;
  }
}

function App() {
  const ruta = useRuta();

  return (
    <>
      <Navbar ruta={ruta} />
      <Rutas ruta={ruta} />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ProveedorSesion>
    <ProveedorCarrito>
      <App />
    </ProveedorCarrito>
  </ProveedorSesion>
);
