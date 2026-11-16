// Hooks de React disponibles en todos los archivos .jsx
const { createContext, useContext, useState, useEffect, useCallback } = React;

function formatoCOP(valor) {
  return '$' + Number(valor).toLocaleString('es-CO') + ' COP';
}

// Las imágenes se guardan con ruta relativa a index.html (ej: assets/img/Totoro.jpg)
function rutaImagen(ruta) {
  if (!ruta) return '';
  return ruta;
}

function cabecerasConToken(token) {
  return { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token };
}

function mensajeDeError(error) {
  if (error instanceof TypeError) {
    return 'No se pudo conectar con el servidor (verifica que node server.js esté corriendo).';
  }
  return error.message;
}

// ----- Rutas con hash: index.html#/catalogo
function leerRuta() {
  return window.location.hash.replace(/^#/, '') || '/';
}

function irA(ruta) {
  window.location.hash = ruta;
}

function useRuta() {
  const [ruta, setRuta] = useState(leerRuta);

  useEffect(() => {
    function cambio() {
      setRuta(leerRuta());
      window.scrollTo(0, 0);
    }
    window.addEventListener('hashchange', cambio);
    return () => window.removeEventListener('hashchange', cambio);
  }, []);

  return ruta;
}
