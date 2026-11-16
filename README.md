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
    ├── index.html
    ├── Conocenos.html
    ├── Catalogo.html
    ├── Carrito.html
    ├── Contacto.html
    ├── Login.html
    ├── Dashboard.html
    └── assets/
        ├── css/
        │   └── style.css
        ├── js/
        │   └── main.js
        └── img/
            ├── B1.jpg
            ├── B2.jpg
            ├── Totoro.jpg
            ├── Calcifer.jpg
            ├── SinCara.jpg
            ├── Mononoke.jpg
            ├── Ponyo.jpg
            └── Kiki.jpg
```

---

## Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3 puro (Flexbox y Grid básico) y JavaScript Vanilla (`fetch` y `localStorage`).
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
- Puedes abrir el archivo `frontend/index.html` directamente en el navegador o usando la extensión **Live Server** de Visual Studio Code.
- Nota: Si el backend aún no tiene productos guardados en MongoDB, el catálogo muestra los productos artesanales base y también carga automáticamente cualquier producto nuevo que agregues desde `Dashboard.html`.

---

## Rutas principales de la API (`server.js`)

- `POST /api/registro` - Registra un usuario nuevo en la base de datos.
- `POST /api/login` - Valida el correo y la contraseña del usuario.
- `GET /api/productos` - Obtiene todos los productos artesanales guardados en MongoDB.
- `POST /api/productos` - Guarda un nuevo producto artesanal desde el Dashboard.
- `DELETE /api/productos/:id` - Elimina un producto por su ID.
- `POST /api/contacto` - Guarda un mensaje enviado desde el formulario de contacto.
- `GET /api/contacto` - Obtiene los mensajes recibidos para verlos en el Dashboard.

