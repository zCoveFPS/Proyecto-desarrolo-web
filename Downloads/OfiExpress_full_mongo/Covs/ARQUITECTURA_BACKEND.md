# 8. Arquitectura Backend (Componentes y Flujo) — 12 pts

## 🏗️ Diagrama de Arquitectura de Capas

```
╔═════════════════════════════════════════════════════════════════════════════╗
║                    OFIEXPRESS - ARQUITECTURA BACKEND                        ║
║                          (Modelo de 5 Capas)                                ║
╚═════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────────┐
│  CAPA 1: PRESENTACIÓN / GUI - FRONTEND                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  [HTML covs/]                                                               │
│  ├── index.html (Catálogo)                                                  │
│  ├── carrito.html (Carrito de compras)                                      │
│  ├── perfil.html (Perfil de usuario)                                        │
│  ├── login.html (Autenticación)                                             │
│  ├── registro.html (Registro usuario)                                       │
│  ├── pedidos.html (Historial de pedidos)                                    │
│  ├── admin-productos.html (Gestión de productos)                            │
│  ├── styles.css (Estilos globales - 914 líneas)                             │
│  └── script.js (Lógica del cliente - Llamadas AJAX)                         │
│                                                                              │
│  📡 Se comunica vía HTTP/AJAX → RESTful API                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
┌──────────────────────────────────────────┐  ┌──────────────────────────────┐
│  CAPA 2A: CONTROLADORES                  │  │  CAPA 2B: MIDDLEWARE         │
├──────────────────────────────────────────┤  ├──────────────────────────────┤
│  src/routes/                             │  │  src/middleware/             │
│  ├── authRoutes.js                       │  │  ├── auth.js                 │
│  │   ├── POST /api/auth/login            │  │  │   ├── validateToken()     │
│  │   ├── POST /api/auth/register         │  │  │   └── checkAuth()         │
│  │   └── POST /api/auth/logout           │  │  │                           │
│  ├── productRoutes.js                    │  │  ├── errorHandler.js         │
│  │   ├── GET /api/products               │  │  │   └── globalErrorHandler()│
│  │   ├── GET /api/products/:id           │  │  │                           │
│  │   └── POST /api/products (admin)      │  │  ├── rateLimiter.js          │
│  ├── cartRoutes.js                       │  │  │   └── limit()             │
│  │   ├── GET /api/cart/:userId           │  │  │                           │
│  │   ├── POST /api/cart/add              │  │  └── validation.js           │
│  │   ├── PUT /api/cart/update            │  │       └── validate()        │
│  │   └── DELETE /api/cart/:itemId        │  │                              │
│  ├── orderRoutes.js                      │  │  📋 Manejo de:               │
│  │   ├── GET /api/orders/:userId         │  │  • Autenticación (JWT)       │
│  │   ├── POST /api/orders                │  │  • Validaciones              │
│  │   └── PUT /api/orders/:id             │  │  • Errores globales          │
│  └── userRoutes.js                       │  │  • Rate limiting             │
│       ├── GET /api/users/:id             │  │  • CORS                      │
│       └── PUT /api/users/:id             │  │                              │
└──────────────────────────────────────────┘  └──────────────────────────────┘
                    │                               │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │                               │
                    ▼                               ▼
┌──────────────────────────────────────────┐  ┌──────────────────────────────┐
│  CAPA 3: SERVICIOS / LÓGICA NEGOCIO      │  │  CAPA 3B: RESOLVERS (GraphQL)│
├──────────────────────────────────────────┤  ├──────────────────────────────┤
│  (Implícito en resolvers.js)             │  │  src/resolvers.js            │
│                                          │  │  ├── userResolver            │
│  • Cálculo de totales en carrito         │  │  │   ├── getUser()          │
│  • Validación de stocks                  │  │  │   └── updateProfile()    │
│  • Procesamiento de pagos                │  │  │                          │
│  • Gestión de órdenes                    │  │  ├── productResolver         │
│  • Autenticación y JWT                   │  │  │   └── getAllProducts()   │
│                                          │  │  │                          │
│  Lógica: Se ejecuta en rutas +           │  │  ├── cartResolver            │
│  directamente en modelos Mongoose        │  │  │   ├── getCart()          │
│                                          │  │  │   └── addToCart()        │
│                                          │  │  │                          │
│                                          │  │  └── orderResolver           │
│                                          │  │      └── createOrder()      │
└──────────────────────────────────────────┘  └──────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  CAPA 4: MODELOS / REPOSITORIO (ORM)                                         │
├──────────────────────────────────────────────────────────────────────────────┤
│  src/models/                                                                 │
│  ├── User.js                                                                 │
│  │   ├── Schema: nombre, email, password(hashed), rol, telefono, dirección  │
│  │   ├── Methods: hashPassword(), validatePassword(), getProfile()          │
│  │   └── Pre-hooks: hash password antes de guardar                           │
│  │                                                                            │
│  ├── Product.js                                                              │
│  │   ├── Schema: nombre, descripcion, precio, categoria, stock, imagen      │
│  │   ├── Methods: getDetails(), updateStock(), checkAvailability()          │
│  │   └── Indexes: nombre, categoria, precio                                 │
│  │                                                                            │
│  ├── Cart.js                                                                 │
│  │   ├── Schema: userId(FK), items[], total, createdAt                      │
│  │   ├── Nested: { productId(FK), cantidad, precioUnitario, subtotal }     │
│  │   ├── Methods: addItem(), removeItem(), updateQuantity(), calculateTotal()│
│  │   └── Validation: cantidad > 0, total >= 0                               │
│  │                                                                            │
│  └── Order.js                                                                │
│       ├── Schema: userId(FK), numeroOrden, items[], total, estado, fecha    │
│       ├── Nested: { productId(FK), cantidad, precioUnitario, subtotal }     │
│       ├── Methods: createOrder(), updateStatus(), trackOrder(), cancel()    │
│       └── Validation: estado ∈ [pendiente, confirmado, enviado, entregado]  │
│                                                                              │
│  🔗 Relaciones:                                                              │
│     • User ←1:N→ Cart (userId FK)                                           │
│     • User ←1:N→ Order (userId FK)                                          │
│     • Cart ←1:N→ CartItems (cartId FK + productId FK)                       │
│     • Order ←1:N→ OrderItems (orderId FK + productId FK)                    │
│     • Product ← N:M → Cart (a través de CartItems)                          │
│     • Product ← N:M → Order (a través de OrderItems)                        │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  CAPA 5: PERSISTENCIA / BASE DE DATOS                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│  src/config/db.js                                                            │
│                                                                               │
│  MongoDB Local (27017)                                                       │
│  Database: "ofiexpress"                                                      │
│                                                                               │
│  Colecciones:                                                                │
│  ├── users                    (Múltiples documentos User)                    │
│  ├── products                 (Múltiples documentos Product)                 │
│  ├── carts                    (Un carrito por usuario)                       │
│  ├── orders                   (Historial de pedidos)                         │
│  └── order_items              (Ítems desglosados de cada orden)              │
│                                                                               │
│  🔍 Índices creados:                                                          │
│     • users: { email: 1 } → UNIQUE                                           │
│     • products: { nombre: 1, categoria: 1 }                                  │
│     • carts: { userId: 1 } → UNIQUE                                          │
│     • orders: { userId: 1, numeroOrden: 1 }                                  │
│     • order_items: { orderId: 1 }                                            │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujos de Comunicación (Request → Response)

### **Flujo 1: Autenticación (Login)**

```
CLIENTE                    MIDDLEWARE              SERVICIO              BASE DE DATOS
   │                           │                      │                        │
   │─── POST /auth/login ──────>│                      │                        │
   │     (email, password)       │                      │                        │
   │                             │──────────────────────>│                        │
   │                             │ Buscar user por email │                        │
   │                             │                      │─────────────────────────>│
   │                             │                      │ db.collection.findOne() │
   │                             │                      │<─────────────────────────│
   │                             │                      │ { _id, email, password} │
   │                             │<──────────────────────│                        │
   │                             │ Validar password      │                        │
   │                             │ (bcrypt.compare)      │                        │
   │                             │                      │                        │
   │                             │ Generar JWT token     │                        │
   │<────────────────────────────│                      │                        │
   │  200 OK + token             │                      │                        │
   │  { accessToken, user }      │                      │                        │
```

**Código real:**
```javascript
// authRoutes.js
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !await user.validatePassword(password)) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ accessToken: token, user: user.getProfile() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

### **Flujo 2: Agregar Producto al Carrito**

```
CLIENTE                 MIDDLEWARE         CONTROLADOR           MODELO            BD
   │                        │                   │                  │               │
   │─ POST /cart/add ─>     │                   │                  │               │
   │ (userId, productId,    │                   │                  │               │
   │  cantidad, token)       │                   │                  │               │
   │                        │─ validateToken()──>│                  │               │
   │                        │  ✓ Token válido    │                  │               │
   │                        │                   │─ getCart() ──────>│               │
   │                        │                   │                  │──────────────>│
   │                        │                   │                  │ findOne cart  │
   │                        │                   │                  │<──────────────│
   │                        │                   │                  │ { items: [] }│
   │                        │                   │─ addItem() ──────>│               │
   │                        │                   │                  │ items.push()  │
   │                        │                   │                  │ calcTotal()   │
   │                        │                   │                  │               │
   │                        │                   │                  │─────────────>│
   │                        │                   │                  │ updateOne()   │
   │                        │                   │                  │<─────────────│
   │<───────────────────────│                   │                  │               │
   │ 200 OK + carrito       │                   │                  │               │
   │ actualizado            │                   │                  │               │
```

**Código real:**
```javascript
// cartRoutes.js
router.post('/add', auth, async (req, res) => {
  try {
    const { userId, productId, cantidad } = req.body;
    
    let cart = await Cart.findOne({ userId });
    const product = await Product.findById(productId);
    
    if (!product || product.stock < cantidad) {
      return res.status(400).json({ error: 'Stock insuficiente' });
    }
    
    const existingItem = cart.items.find(i => i.productId.equals(productId));
    if (existingItem) {
      existingItem.cantidad += cantidad;
    } else {
      cart.items.push({ productId, cantidad, precioUnitario: product.precio });
    }
    
    cart.total = cart.items.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

### **Flujo 3: Crear Pedido (Checkout)**

```
CLIENTE              AUTH             VALIDACIÓN           SERVICIO            BD
   │                 │                    │                   │                │
   │─ POST /order ──>│                    │                   │                │
   │ (userId, token) │                    │                   │                │
   │                 │─ validateToken() ──>│                   │                │
   │                 │                    │ ✓ Token OK        │                │
   │                 │                    │                   │                │
   │                 │                    │─ getCart() ───────>│                │
   │                 │                    │                   │──────────────>│
   │                 │                    │                   │ fetch cart    │
   │                 │                    │                   │<──────────────│
   │                 │                    │ Validar stock     │                │
   │                 │                    │ Validar total     │                │
   │                 │                    │ ✓ OK              │                │
   │                 │                    │                   │                │
   │                 │                    │─ createOrder() ───>│                │
   │                 │                    │                   │──────────────>│
   │                 │                    │                   │ insert Order  │
   │                 │                    │                   │<──────────────│
   │                 │                    │                   │─────────────>│
   │                 │                    │                   │ updateStock() │
   │                 │                    │                   │<─────────────│
   │                 │                    │                   │─────────────>│
   │                 │                    │                   │ clearCart()   │
   │                 │                    │                   │<─────────────│
   │<────────────────────────────────────────────────────────│                │
   │ 201 CREATED     │                    │                   │                │
   │ { orderId,      │                    │                   │                │
   │   numeroOrden,  │                    │                   │                │
   │   items,        │                    │                   │                │
   │   total }       │                    │                   │                │
```

**Código real:**
```javascript
// orderRoutes.js
router.post('/', auth, async (req, res) => {
  try {
    const { userId, direccionEnvio } = req.body;
    
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Carrito vacío' });
    }
    
    // Validar stock
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product.stock < item.cantidad) {
        return res.status(400).json({ error: `Stock insuficiente: ${product.nombre}` });
      }
    }
    
    // Crear pedido
    const order = new Order({
      userId,
      numeroOrden: `ORD-${Date.now()}`,
      items: cart.items,
      total: cart.total,
      direccionEnvio,
      estado: 'pendiente'
    });
    
    await order.save();
    
    // Actualizar stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.cantidad } }
      );
    }
    
    // Limpiar carrito
    cart.items = [];
    cart.total = 0;
    await cart.save();
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 🛡️ Middleware, Validaciones y Tratamiento de Errores

### **Middleware de Autenticación**

```javascript
// src/middleware/auth.js
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token requerido' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
```

### **Validación de Entrada**

```javascript
// src/middleware/validation.js
const validateCartItem = (req, res, next) => {
  const { productId, cantidad } = req.body;
  
  if (!productId || typeof productId !== 'string') {
    return res.status(400).json({ error: 'productId inválido' });
  }
  
  if (!cantidad || cantidad <= 0 || cantidad > 1000) {
    return res.status(400).json({ error: 'cantidad debe ser entre 1 y 1000' });
  }
  
  next();
};
```

### **Manejo Global de Errores**

```javascript
// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Datos inválidos', details: err.message });
  }
  
  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(409).json({ error: 'Recurso duplicado' });
  }
  
  res.status(500).json({ error: 'Error interno del servidor' });
};
```

---

## 📊 Flujo Completo: Cliente → API → DB → Respuesta

```
┌────────────────────────────────────────────────────────────────────┐
│                    CICLO DE VIDA DE UNA REQUEST                    │
└────────────────────────────────────────────────────────────────────┘

1. CLIENTE ENVÍA REQUEST
   ↓
   POST /api/cart/add HTTP/1.1
   Host: localhost:5000
   Authorization: Bearer <JWT_TOKEN>
   Content-Type: application/json
   
   {
     "userId": "507f1f77bcf86cd799439011",
     "productId": "507f1f77bcf86cd799439012",
     "cantidad": 2
   }

2. SERVIDOR RECIBE (Express)
   ↓
   app.use(express.json())  // Parsea JSON
   app.use('/api/cart', cartRoutes)

3. MIDDLEWARE CHAIN
   ↓
   auth.js (validateToken)  // Valida JWT
   ↓
   validation.js            // Valida schema
   ↓
   Express route handler

4. CONTROLADOR (cartRoutes.js)
   ↓
   • Extrae userId, productId, cantidad
   • Obtiene carrito actual
   • Obtiene datos del producto
   • Valida stock
   • Agrega item al carrito
   • Recalcula total

5. ACCESO A MODELOS (Mongoose)
   ↓
   Cart.findOne({ userId })
   Product.findById(productId)
   cart.save()

6. BASE DE DATOS (MongoDB)
   ↓
   db.carts.findOne()        // Obtiene carrito
   db.products.findOne()     // Obtiene producto
   db.carts.updateOne()      // Actualiza carrito

7. RESPUESTA A CLIENTE
   ↓
   HTTP/1.1 200 OK
   Content-Type: application/json
   
   {
     "_id": "507f1f77bcf86cd799439013",
     "userId": "507f1f77bcf86cd799439011",
     "items": [
       {
         "productId": "507f1f77bcf86cd799439012",
         "cantidad": 2,
         "precioUnitario": 9.99,
         "subtotal": 19.98
       }
     ],
     "total": 19.98,
     "createdAt": "2025-12-05T10:30:00Z"
   }

8. CLIENTE PROCESA RESPUESTA
   ↓
   JavaScript actualiza DOM
   Muestra nuevo total en carrito
   Notifica al usuario
```

---

## 🎯 Cumplimiento de Criterios

| Requerimiento | Descripción | ✅ Cumplido |
|---------------|------------|-----------|
| **Diagrama de arquitectura con capas** | 5 capas: Presentación, Controladores, Servicios, Modelos, BD | ✅ Sí |
| **GUI/Frontend** | HTML + CSS + JavaScript (interactivo) | ✅ Sí |
| **Controladores** | authRoutes, productRoutes, cartRoutes, orderRoutes | ✅ Sí |
| **Servicios** | Lógica negocio en controladores + métodos de modelos | ✅ Sí |
| **Repositorios/Modelos** | User, Product, Cart, Order con métodos | ✅ Sí |
| **Base de Datos** | MongoDB con colecciones relacionadas | ✅ Sí |
| **Flujos de comunicación** | Login, agregar carrito, crear pedido documentados | ✅ Sí |
| **Middleware, validaciones, errores** | auth.js, validation.js, errorHandler.js | ✅ Sí |
| **Flujo Cliente → API → DB → Respuesta** | Ciclo completo ilustrado | ✅ Sí |

---

## 📝 Conclusión

La arquitectura backend de **OfiExpress** sigue un **modelo de 5 capas** claramente definido con:
- ✅ Separación de responsabilidades
- ✅ Flujos de datos bidireccionales documentados
- ✅ Middleware de seguridad y validación
- ✅ Manejo centralizado de errores
- ✅ Comunicación cliente ↔ API ↔ BD totalmente mapeada
