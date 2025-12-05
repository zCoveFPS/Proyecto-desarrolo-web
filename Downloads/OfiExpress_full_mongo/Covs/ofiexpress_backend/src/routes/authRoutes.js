import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const authRouter = express.Router();

// POST /api/auth/register
authRouter.post('/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) return res.status(400).json({ message: 'nombre, email y password son requeridos' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email ya registrado' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ nombre, email, passwordHash: hash });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    const safeUser = user.toObject();
    delete safeUser.passwordHash;
    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    console.error('Error en /api/auth/register', err);
    res.status(500).json({ message: 'Error interno' });
  }
});

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email y password son requeridos' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, user.passwordHash || '');
    if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    const safeUser = user.toObject();
    delete safeUser.passwordHash;
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error('Error en /api/auth/login', err);
    res.status(500).json({ message: 'Error interno' });
  }
});
