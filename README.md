# Proyecto Web - Tienda Artesanal Ghibli (Arte & Hecho a Mano)

Este proyecto fue desarrollado como entrega de semestre para la materia de Desarrollo Web. Consiste en una tienda en línea (Frontend y Backend) para un emprendimiento imaginario de productos artesanales y arte propio inspirados en las películas de Studio Ghibli (Mi Vecino Totoro, El Viaje de Chihiro, El Castillo Vagabundo, La Princesa Mononoke y Ponyo).

El diseño visual está inspirado en tiendas minimalistas como **Gef.co**, usando colores claros, tipografía limpia, menú superior fijo, banners amplios y tarjetas de productos ordenadas en cuadrícula.

---

## Estructura del Proyecto

```text
Proyecto-Ghibli/
├── README.md
├── backend/
│   ├── package.json
│   ├── server.js
│   └── models/
│       ├── Usuario.js
│       ├── Producto.js
│       └── Contacto.js
└── frontend/
    ├── index.html              (carga React y arranca la app)
    └── assets/
        ├── css/style.css
        ├── img/                (imágenes del sitio)
        └── js/react/
            ├── datos.js        (URL del backend y productos base)
            ├── utilidades.js   (formato de precios, rutas por hash)
            ├── contextos.jsx   (carrito y sesión)
            ├── componentes.jsx (Navbar, Footer, TarjetaProducto)
            ├── paginas.jsx     (Inicio, Conócenos, Catálogo, Carrito, Contacto, Login, Dashboard)
            └── app.jsx         (rutas y arranque; debe cargarse al final)
```

---

## Tecnologías Utilizadas

- **Frontend:** React 18 cargado por CDN (sin Vite ni compilación, JSX con Babel en el navegador), CSS3 puro, `fetch` y `localStorage`.
- **Backend:** Node.js con Express.
- **Base de Datos:** MongoDB conectada mediante Mongoose.

---

## Cómo ejecutar el proyecto paso a paso

### 1. Requisitos previos
- Tener instalado **Node.js**.
- Tener instalado y corriendo **MongoDB** de forma local (`mongodb://127.0.0.1:27017/tienda_ghibli`).

### 2. Iniciar el Backend
1. Abrir una terminal en la carpeta `backend`:
   ```bash
   cd backend
   ```
2. Instalar las dependencias necesarias (`express`, `mongoose`, `cors`):
   ```bash
   npm install
   ```
3. Iniciar el servidor:
   ```bash
   node server.js
   ```
   El servidor quedará corriendo en `http://localhost:3000`.

### 3. Abrir el Frontend
- Abre la carpeta `frontend` con la extensión **Live Server** de Visual Studio Code y ejecuta `index.html` (necesita internet para descargar React desde el CDN).
- No lo abras con doble clic: los archivos `.jsx` se cargan con peticiones del navegador y necesitan un servidor local.
- Las páginas se navegan con `#`: `index.html#/catalogo`, `#/carrito`, `#/login`, etc.
- Nota: Si el backend aún no tiene productos guardados en MongoDB, el catálogo muestra los productos artesanales base y también carga automáticamente cualquier producto nuevo que agregues desde el Dashboard.

---

## Rutas principales de la API (`server.js`)

- `POST /api/registro` - Registra un usuario nuevo en la base de datos.
- `POST /api/login` - Valida el correo y la contraseña del usuario.
- `GET /api/productos` - Obtiene todos los productos artesanales guardados en MongoDB.
- `POST /api/productos` - Guarda un nuevo producto artesanal desde el Dashboard.
- `DELETE /api/productos/:id` - Elimina un producto por su ID.
- `POST /api/contacto` - Guarda un mensaje enviado desde el formulario de contacto.
- `GET /api/contacto` - Obtiene los mensajes recibidos para verlos en el Dashboard.

