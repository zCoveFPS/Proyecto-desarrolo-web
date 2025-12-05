import express from "express";
import { User } from "../models/User.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const userRouter = express.Router();

// POST /api/users/register
userRouter.post("/register", async (req, res) => {
  try {
    const { nombre, email } = req.body;
    if (!nombre || !email) {
      return res.status(400).json({ message: "Nombre y email son obligatorios" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    const user = await User.create({ nombre, email });
    return res.status(201).json(user);
  } catch (err) {
    console.error("Error en /api/users/register:", err);
    return res.status(500).json({ message: "Error interno" });
  }
});

// GET /api/users/public  -> lista pública, sólo campos no sensibles (DEBE ESTAR ANTES DE /:id)
userRouter.get('/public', async (_req, res) => {
  try {
    const users = await User.find().select('nombre email role estado createdAt').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Error en GET /api/users/public', err);
    res.status(500).json({ message: 'Error interno' });
  }
});

// GET /api/users
userRouter.get("/", requireAuth, requireRole('Administrador'), async (_req, res) => {
  const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
  res.json(users);
});

// GET /api/users/:id  -> obtener datos de un usuario específico (requiere autenticación)
userRouter.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error en GET /api/users/:id', err);
    res.status(500).json({ message: 'Error interno' });
  }
});

// PUT /api/users/:id  -> actualizar datos de un usuario (requiere autenticación)
userRouter.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, direccion } = req.body;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Solo el usuario puede actualizar sus propios datos
    if (req.user._id.toString() !== id) {
      return res.status(403).json({ message: 'No tienes permisos para actualizar este usuario' });
    }
    
    if (nombre) user.nombre = nombre;
    if (telefono) user.telefono = telefono;
    if (direccion) user.direccion = direccion;
    
    await user.save();
    const safe = user.toObject(); delete safe.passwordHash;
    res.json(safe);
  } catch (err) {
    console.error('Error en PUT /api/users/:id', err);
    res.status(500).json({ message: 'Error interno' });
  }
});

// PATCH /api/users/:id/role  -> cambiar rol de usuario
userRouter.patch('/:id/role', requireAuth, requireRole('Administrador'), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!role) return res.status(400).json({ message: 'role es requerido' });
    const allowed = ['Cliente','Vendedor','Administrador'];
    if (!allowed.includes(role)) return res.status(400).json({ message: 'role inválido' });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    user.role = role;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error('Error en PATCH /api/users/:id/role', err);
    res.status(500).json({ message: 'Error interno' });
  }
});
