# tienda.local — Contenedor Express + TypeScript (Clase 19 GSW)

Reverse proxy con Apache: Apache (puerto 80) → tienda.local (puerto 3000).

## Rutas
- GET /saludo?nombre=X
- GET /info
- GET /cotizacion
- GET /productos
- GET /productos/:id
- POST /productos        { nombre, precio, stock, categoria }
- PUT  /productos/:id
- DELETE /productos/:id

## Local
    npm install
    npm run build
    npm start
