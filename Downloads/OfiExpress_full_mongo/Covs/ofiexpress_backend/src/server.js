import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import { userRouter } from "./routes/userRoutes.js";
import { productRouter } from "./routes/productRoutes.js";
import { cartRouter } from "./routes/cartRoutes.js";
import { authRouter } from "./routes/authRoutes.js";
import { orderRouter } from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Conexión a MongoDB
await connectDB();

// Middlewares
app.use(helmet()); // seguridad headers básicos
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rate limiter: protege contra brute-force y abuso básico
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 120, // max 120 requests por IP por minuto
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// API REST
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', orderRouter);

// Servir frontend estático (opcional)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../../Html covs");
app.use(express.static(publicDir));

// Servir uploads
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Ruta raíz: index.html del frontend
app.get("/", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor OfiExpress escuchando en http://localhost:${PORT}`);
});
