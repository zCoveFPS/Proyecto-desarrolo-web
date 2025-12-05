import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { Product } from "../models/Product.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const productRouter = express.Router();

// multer config -> guarda en uploads/ (ruta resuelta relativa al archivo)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// GET /api/products
productRouter.get("/", async (_req, res) => {
  try {
    const products = await Product.find().sort({ nombre: 1 });
    res.json(products);
  } catch (err) {
    console.error("Error en GET /api/products:", err);
    res.status(500).json({ message: "Error interno" });
  }
});

// POST /api/products  -> crear producto (admin)
productRouter.post('/', requireAuth, requireRole('Administrador'), upload.single('productImage'), async (req, res) => {
  try {
    const { nombre, descripcion, precioCLP, categoria, stock } = req.body;
    const precioNum = Number(precioCLP);
    if (!nombre || !Number.isFinite(precioNum) || !categoria) {
      return res.status(400).json({ message: 'nombre, precioCLP (numérico) y categoria son requeridos' });
    }
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const p = await Product.create({ nombre, descripcion, precioCLP: precioNum, categoria, stock: Number(stock) || 0, imageUrl });
    res.status(201).json(p);
  } catch (err) {
    console.error('Error en POST /api/products', err);
    res.status(500).json({ message: 'Error interno' });
  }
});

// PUT /api/products/:id -> actualizar producto (admin)
productRouter.put('/:id', requireAuth, requireRole('Administrador'), upload.single('productImage'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;
    if (updates.precioCLP !== undefined) {
      const precioNum = Number(updates.precioCLP);
      if (!Number.isFinite(precioNum)) return res.status(400).json({ message: 'precioCLP debe ser numérico' });
      updates.precioCLP = precioNum;
    }
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);
    const p = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!p) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(p);
  } catch (err) {
    console.error('Error en PUT /api/products/:id', err);
    res.status(500).json({ message: 'Error interno' });
  }
});

// PATCH /api/products/:id/deactivate -> activar/desactivar (admin)
productRouter.patch('/:id/deactivate', requireAuth, requireRole('Administrador'), async (req, res) => {
  try {
    const { id } = req.params;
    const p = await Product.findById(id);
    if (!p) return res.status(404).json({ message: 'Producto no encontrado' });
    p.activo = !p.activo;
    await p.save();
    res.json(p);
  } catch (err) {
    console.error('Error en PATCH /api/products/:id/deactivate', err);
    res.status(500).json({ message: 'Error interno' });
  }
});

// Note: protected admin endpoints implemented above. Public endpoints left only for safe operations (GET /)
