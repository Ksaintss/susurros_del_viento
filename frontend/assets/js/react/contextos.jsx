// =====================  CARRITO  =====================
const ContextoCarrito = createContext(null);

function leerCarrito() {
  try {
    const guardado = localStorage.getItem('carritoGhibli');
    return guardado ? JSON.parse(guardado) : [];
  } catch {
    return [];
  }
}

function ProveedorCarrito({ children }) {
  const [carrito, setCarrito] = useState(leerCarrito);

  useEffect(() => {
    try {
      localStorage.setItem('carritoGhibli', JSON.stringify(carrito));
    } catch {
      /* si localStorage no está disponible, el carrito vive en memoria */
    }
  }, [carrito]);

  function agregar({ nombre, precio, personaje, imagen }) {
    setCarrito((actual) => [...actual, { nombre, precio: Number(precio), personaje, imagen }]);
  }

  function quitar(indice) {
    setCarrito((actual) => actual.filter((_, i) => i !== indice));
  }

  function vaciar() {
    setCarrito([]);
  }

  const total = carrito.reduce((suma, item) => suma + item.precio, 0);

  return (
    <ContextoCarrito.Provider value={{ carrito, total, agregar, quitar, vaciar }}>
      {children}
    </ContextoCarrito.Provider>
  );
}

function useCarrito() {
  return useContext(ContextoCarrito);
}

// =====================  SESIÓN  =====================
const ContextoSesion = createContext(null);

function leerUsuario() {
  try {
    return JSON.parse(localStorage.getItem('usuarioGhibli') || 'null');
  } catch {
    return null;
  }
}

function ProveedorSesion({ children }) {
  const [usuario, setUsuario] = useState(leerUsuario);
  const [token, setToken] = useState(() => localStorage.getItem('tokenGhibli'));

  const iniciarSesion = useCallback((datosUsuario, nuevoToken) => {
    localStorage.setItem('usuarioGhibli', JSON.stringify(datosUsuario));
    localStorage.setItem('tokenGhibli', nuevoToken);
    setUsuario(datosUsuario);
    setToken(nuevoToken);
  }, []);

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem('usuarioGhibli');
    localStorage.removeItem('tokenGhibli');
    setUsuario(null);
    setToken(null);
  }, []);

  const esAdmin = Boolean(usuario && usuario.rol === 'admin' && token);

  return (
    <ContextoSesion.Provider value={{ usuario, token, esAdmin, iniciarSesion, cerrarSesion }}>
      {children}
    </ContextoSesion.Provider>
  );
}

function useSesion() {
  return useContext(ContextoSesion);
}
