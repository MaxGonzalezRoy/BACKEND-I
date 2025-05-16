# 🛒 Backend E-Commerce - Proyecto Final

Este proyecto es una aplicación backend desarrollada con **Node.js**, **Express** y **MongoDB**, que simula el backend de una tienda online. Incluye funcionalidades completas de gestión de productos y carritos, consultas avanzadas con filtros, ordenamiento y paginación, y vistas dinámicas renderizadas con **Handlebars**.

## 🔧 Tecnologías utilizadas

- **Node.js** / **Express** – Servidor y rutas REST.
- **MongoDB** / **Mongoose** – Persistencia principal y modelos relacionales.
- **Handlebars** – Motor de plantillas para renderizado de vistas.
- **WebSockets (Socket.io)** – Actualización en tiempo real de productos.
- **SweetAlert2** – Interacción visual en el frontend.
- **Tailwind CSS** – Estilos modernos y responsive.

---

## 🧩 Funcionalidades principales

### 📦 Gestión de productos

- **CRUD completo**: Alta, baja, modificación y consulta de productos.
- **GET /api/products** con:
  - `limit` (opcional): cantidad de resultados.
  - `page` (opcional): página deseada.
  - `sort` (opcional): orden ascendente/descendente por precio.
  - `query` (opcional): filtro por categoría o disponibilidad.

- **Respuesta paginada** con estructura:
```json
{
  "status": "success",
  "payload": [ /* productos */ ],
  "totalPages": 5,
  "prevPage": 1,
  "nextPage": 3,
  "page": 2,
  "hasPrevPage": true,
  "hasNextPage": true,
  "prevLink": "/api/products?page=1",
  "nextLink": "/api/products?page=3"
}
```

- **GET /api/products/:pid** – Detalle completo del producto.

---

### 🛒 Gestión de carritos

- **POST /api/carts** – Crea un nuevo carrito.
- **GET /api/carts/:cid** – Devuelve los productos del carrito (con `populate`).
- **POST /api/carts/:cid/products/:pid** – Agrega un producto al carrito.
- **PUT /api/carts/:cid** – Reemplaza los productos del carrito.
- **PUT /api/carts/:cid/products/:pid** – Actualiza la cantidad de un producto.
- **DELETE /api/carts/:cid/products/:pid** – Elimina un producto del carrito.
- **DELETE /api/carts/:cid** – Vacía completamente el carrito.

> ⚠️ La propiedad `products` del modelo `Cart` almacena únicamente los IDs de productos, pero utiliza `populate` para mostrar los detalles completos al consultarlos.

---

## 🌐 Vistas dinámicas

### `/products`
- Lista paginada de productos con filtros.
- Botón directo para **agregar al carrito**.

### `/products/:pid`
- Vista individual del producto: descripción, precio, categoría, etc.

### `/carts/:cid`
- Vista específica de un carrito con el detalle completo de los productos agregados.

---

## 🚀 Instalación y ejecución

1. Cloná el repositorio:
   ```bash
   git clone https://github.com/MaxGonzalezRoy/BACKEND-I.git
   ```

2. Instalá las dependencias:
   ```bash
   npm install
   ```

3. Renombrá `.env.example` a `.env` y completá tus variables de entorno:
   ```env
   MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/ecommerce
   PORT=8080
   ```

4. Ejecutá el servidor:
   ```bash
   npm start
   ```

---

## 🧪 Extras

- Uso de **DAOs** para facilitar el cambio de persistencia (archivos ↔ MongoDB).
- Separación en capas: routes, controllers, managers, daos y models.

---

## 👨‍💻 Autor

Desarrollado por **Maximiliano Gonzalez Roy**  
📁 [Repositorio del proyecto](https://github.com/MaxGonzalezRoy/BACKEND-I.git)  
🕓 Último commit: `"Entrega final - Backend E-Commerce"`

---

¡Gracias por revisar el proyecto! 💥