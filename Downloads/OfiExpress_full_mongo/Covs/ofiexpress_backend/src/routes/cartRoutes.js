import express from "express";
import { Cart } from "../models/Cart.js";
import { User } from "../models/User.js";
import { Product } from "../models/Product.js";

export const cartRouter = express.Router();

// Helper para obtener o crear carrito de un usuario
async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await cart.populate("items.product");
  }
  return cart;
}

// GET /api/cart/:userId
cartRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const cart = await getOrCreateCart(user._id);
    res.json(cart);
  } catch (err) {
    console.error("Error en GET /api/cart/:userId:", err);
    res.status(500).json({ message: "Error interno" });
  }
});

// POST /api/cart/add
cartRouter.post("/add", async (req, res) => {
  try {
    const { userId, productId, cantidad } = req.body;
    const cantidadNum = Number(cantidad);
    if (!userId || !productId || !Number.isFinite(cantidadNum) || cantidadNum <= 0) {
      return res.status(400).json({ message: "userId, productId y cantidad (numérica > 0) son obligatorios" });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    const cart = await getOrCreateCart(user._id);

    const idx = cart.items.findIndex((i) => i.product.toString() === product._id.toString());
    if (idx >= 0) {
      cart.items[idx].cantidad += cantidadNum;
    } else {
      cart.items.push({
        product: product._id,
        cantidad: cantidadNum,
        precioUnitCLP: product.precioCLP,
      });
    }

    await cart.save();
    const populated = await Cart.findById(cart._id).populate("items.product");
    res.json(populated);
  } catch (err) {
    console.error("Error en POST /api/cart/add:", err);
    res.status(500).json({ message: "Error interno" });
  }
});

// POST /api/cart/update
cartRouter.post("/update", async (req, res) => {
  try {
    const { userId, productId, cantidad } = req.body;
    const cantidadNum = Number(cantidad);
    if (!userId || !productId || !Number.isFinite(cantidadNum)) {
      return res.status(400).json({ message: "userId, productId y cantidad (numérica) son obligatorios" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    let cart = await getOrCreateCart(user._id);
    // Búsqueda sin populate para encontrar el índice (product es ObjectId)
    const cartRaw = await Cart.findOne({ user: user._id });
    const idx = cartRaw.items.findIndex((i) => i.product.toString() === productId);
    if (idx < 0) {
      return res.status(404).json({ message: "Item no existe en el carrito" });
    }

    if (cantidadNum <= 0) {
      cartRaw.items.splice(idx, 1);
    } else {
      cartRaw.items[idx].cantidad = cantidadNum;
    }

    await cartRaw.save();
    const populated = await Cart.findById(cartRaw._id).populate("items.product");
    res.json(populated);
  } catch (err) {
    console.error("Error en POST /api/cart/update:", err);
    res.status(500).json({ message: "Error interno" });
  }
});

// POST /api/cart/clear
cartRouter.post("/clear", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const cart = await getOrCreateCart(user._id);
    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Error en POST /api/cart/clear:", err);
    res.status(500).json({ message: "Error interno" });
  }
});
