# 🚀 Plan de Implementación de Backend: UltimoPrecio Ecommerce

Este documento detalla los requerimientos y la arquitectura necesaria para migrar la lógica actual de "Frontend-Only" a un sistema con un Backend robusto y persistencia real en base de datos.

---

## 1. Arquitectura Recomendada

Para mantener la velocidad y simplicidad del proyecto actual, se recomiendan dos caminos:

### Opción A: Node.js + Express + PostgreSQL/MongoDB (Tradicional)
*   **Ideal para:** Control total sobre los archivos físicos y la lógica de negocio.
*   **Ventaja:** Puedes usar módulos como `fs` para seguir escribiendo en archivos JSON si lo deseas, o migrar a una base de datos real.

### Opción B: Supabase / Firebase (BaaS)
*   **Ideal para:** Implementación rápida sin gestionar servidores.
*   **Ventaja:** Gestión de usuarios y almacenamiento de imágenes (Storage) ya incluidos.

---

## 2. Definición de la API (Endpoints)

El backend deberá exponer los siguientes puntos de acceso para que el Panel de Admin y la Tienda se comuniquen:

### 📦 Gestión de Productos
*   `GET /api/products`: Obtener catálogo completo.
*   `GET /api/products/:category`: Filtrar por categoría.
*   `POST /api/products`: Crear producto (debe recibir el objeto `specs` dinámico).
*   `PUT /api/products/:id`: Actualizar datos o stock.
*   `DELETE /api/products/:id`: Eliminar producto.

### 🖼️ Gestión de Banners
*   `GET /api/banners`: Obtener configuración de banners (Home y Categorías).
*   `POST /api/banners`: Subir nuevo banner (vincular a categoría o `home`).
*   `DELETE /api/banners/:id`: Quitar banner.

### 📂 Gestión de Categorías
*   `GET /api/categories`: Listar categorías.
*   `POST /api/categories`: Crear nueva categoría (slug, label, icon).

---

## 3. Gestión de Archivos (Imágenes)

Uno de los mayores cambios será cómo manejamos las fotos. Ya no usaremos Base64 pesado en el JSON.

1.  **Storage**: Las imágenes se deben guardar en una carpeta física (ej. `/uploads/products`) o en la nube (Cloudinary/S3).
2.  **Referencia**: En la base de datos o JSON solo guardaremos la **URL** de la imagen (ej. `https://miapi.com/uploads/laptop-1.jpg`).
3.  **Procesamiento**: El backend debería redimensionar las imágenes automáticamente para que los banners pesen poco y la tienda cargue rápido.

---

## 4. Persistencia de Datos

Para que los cambios se guarden "físicamente" como quieres:

*   **Si usas Base de Datos**: Los datos viven en el motor de DB (PostgreSQL/MongoDB). Es lo más profesional.
*   **Si quieres seguir con JSON**: El backend usará el módulo `fs` (File System) para sobreescribir los archivos `laptops.json`, `gpus.json`, etc., cada vez que el Admin haga un cambio.

---

## 5. Seguridad y Autenticación

Actualmente usamos variables de entorno en el Front. En el Backend debemos:
*   **JWT (JSON Web Tokens)**: Al hacer login, el servidor entrega un token. El Front lo envía en cada petición para demostrar que es el Admin.
*   **Validación**: El servidor debe revisar que los precios sean números, que los nombres no tengan código malicioso (XSS) y que las imágenes no superen los 5MB.
*   **CORS**: Configurar el backend para que solo acepte peticiones desde el dominio de tu tienda.

---

## 6. Pasos para la Migración

Cuando decidas empezar, estos serán los pasos:

1.  **Crear el servidor**: Inicializar un proyecto con Express.
2.  **Mover los JSON**: Pasar los archivos de `src/data/` al servidor.
3.  **Crear los controladores**: Escribir las funciones que leen y escriben esos archivos.
4.  **Actualizar el Front**: Cambiar las funciones en `src/data/index.js` para que en lugar de usar `localStorage`, usen `fetch()` o `axios` hacia tu nueva API.
5.  **Subida de archivos**: Reemplazar la lógica de Base64 por un `FormData` que envíe el archivo real al servidor.

---

## 7. Checklist de Funcionalidades "Must-Have"

- [ ] Soporte para **especificaciones técnicas dinámicas** (que el backend no se rompa si añades un campo nuevo).
- [ ] Sistema de **Búsqueda en el Servidor** (para que sea más rápido cuando tengas miles de productos).
- [ ] **Logs de actividad**: Saber qué admin cambió qué producto y cuándo.
- [ ] **Backup automático**: Que el servidor haga una copia de seguridad de los JSON cada 24 horas.

---

> [!TIP]
> Mientras no tengas el backend, la solución actual de **LocalStorage + Exportar JSON** es la más segura y estable para que no pierdas trabajo y mantengas el control total de tus archivos.
