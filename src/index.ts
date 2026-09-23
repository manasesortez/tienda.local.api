import express, { Request, Response } from "express";
import { readJSON, writeJSON } from "./db";

const app = express();
app.use(express.json());

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
}

const FILE = "productos.json";

// ---------- Rutas heredadas de la Unidad 1 ----------
app.get("/saludo", (req: Request, res: Response) => {
  const nombre = (req.query.nombre as string) || "mundo";
  res.json({ mensaje: `Hola, ${nombre}!` });
});

app.get("/info", (_req, res) => {
  res.json({
    servicio: "tienda.local",
    version: "1.0.0",
    so: process.platform,
    node: process.version,
    fecha: new Date().toISOString()
  });
});

app.get("/cotizacion", (_req, res) => {
  res.json({ moneda: "USD", compra: 8.75, venta: 8.85, fecha: new Date().toISOString() });
});

// ---------- CRUD de productos (DB en JSON) ----------
app.get("/productos", (_req, res) => {
  res.json(readJSON<Producto[]>(FILE));
});

app.get("/productos/:id", (req, res) => {
  const items = readJSON<Producto[]>(FILE);
  const item = items.find((p) => p.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(item);
});

app.post("/productos", (req, res) => {
  const items = readJSON<Producto[]>(FILE);
  const nuevo: Producto = {
    id: items.length ? Math.max(...items.map((p) => p.id)) + 1 : 1,
    nombre: req.body.nombre,
    precio: Number(req.body.precio) || 0,
    stock: Number(req.body.stock) || 0,
    categoria: req.body.categoria || "General"
  };
  items.push(nuevo);
  writeJSON(FILE, items);
  res.status(201).json(nuevo);
});

app.put("/productos/:id", (req, res) => {
  const items = readJSON<Producto[]>(FILE);
  const idx = items.findIndex((p) => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Producto no encontrado" });
  items[idx] = { ...items[idx], ...req.body, id: items[idx].id };
  writeJSON(FILE, items);
  res.json(items[idx]);
});

app.delete("/productos/:id", (req, res) => {
  const items = readJSON<Producto[]>(FILE);
  const filtrados = items.filter((p) => p.id !== Number(req.params.id));
  if (filtrados.length === items.length)
    return res.status(404).json({ error: "Producto no encontrado" });
  writeJSON(FILE, filtrados);
  res.status(204).send();
});

// ---------- Arranque ----------
const PORT = Number(process.env.PORT) || 9090;
app.listen(PORT, () => {
  console.log(`tienda.local escuchando en http://localhost:${PORT}`);
});