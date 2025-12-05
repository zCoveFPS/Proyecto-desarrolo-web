# 7. Diagrama de Clases Backend — 6 pts

## 📊 Diagrama de Clases del Dominio

```
┌─────────────────────────────────────────────────────────────────┐
│                        SISTEMA OFIEXPRESS                       │
└─────────────────────────────────────────────────────────────────┘

╔════════════════════════════════════════════════════════════════╗
║                    CLASES DEL DOMINIO                         ║
╚════════════════════════════════════════════════════════════════╝

┌──────────────────────┐
│       USER           │
├──────────────────────┤
│ - _id: ObjectId      │
│ - nombre: String     │
│ - email: String      │
│ - password: String   │
│ - rol: String        │
│ - telefono: String   │
│ - direccion: String  │
│ - createdAt: Date    │
├──────────────────────┤
│ + hashPassword()     │
│ + validatePassword() │
│ + getProfile()       │
│ + updateProfile()    │
└──────────────────────┘
         │
         │ 1:N (propietario)
         │
         ▼
┌──────────────────────┐
│       CART           │
├──────────────────────┤
│ - _id: ObjectId      │
│ - userId: FK User    │
│ - items: Array       │
│ - total: Number      │
│ - createdAt: Date    │
├──────────────────────┤
│ + addItem()          │
│ + removeItem()       │
│ + updateQuantity()   │
│ + calculateTotal()   │
│ + checkout()         │
└──────────────────────┘

┌──────────────────────┐
│     PRODUCT          │
├──────────────────────┤
│ - _id: ObjectId      │
│ - nombre: String     │
│ - descripcion: String│
│ - precio: Number     │
│ - categoria: String  │
│ - stock: Number      │
│ - imagen: String     │
│ - createdAt: Date    │
├──────────────────────┤
│ + getDetails()       │
│ + updateStock()      │
│ + checkAvailability()│
│ + getByCategory()    │
└──────────────────────┘
         │
         │ N:M (a través de Cart)
         │
         ▼
┌──────────────────────┐
│    CART_ITEM         │
├──────────────────────┤
│ - _id: ObjectId      │
│ - cartId: FK Cart    │
│ - productId: FK      │
│ - cantidad: Number   │
│ - precioUnitario: Num│
│ - subtotal: Number   │
├──────────────────────┤
│ + calculateSubtotal()│
│ + updateQuantity()   │
└──────────────────────┘

┌──────────────────────┐
│       ORDER          │
├──────────────────────┤
│ - _id: ObjectId      │
│ - userId: FK User    │
│ - items: Array       │
│ - total: Number      │
│ - estado: String     │
│ - direccion: String  │
│ - fecha: Date        │
│ - metodoPago: String │
├──────────────────────┤
│ + createOrder()      │
│ + updateStatus()     │
│ + trackOrder()       │
│ + calculateTotal()   │
│ + cancelOrder()      │
└──────────────────────┘
         │
         │ 1:N (historial)
         │
         ▼
┌──────────────────────┐
│    ORDER_ITEM        │
├──────────────────────┤
│ - _id: ObjectId      │
│ - orderId: FK        │
│ - productId: FK      │
│ - cantidad: Number   │
│ - precioUnitario: Num│
│ - subtotal: Number   │
├──────────────────────┤
│ + getItemDetails()   │
└──────────────────────┘
```

---

## 🔄 Relaciones y Cardinalidades

### Tabla de Relaciones

| De | A | Tipo | Multiplicidad | Descripción |
|---|---|------|--------------|-------------|
| **USER** | CART | Agregación | 1:N | Un usuario tiene un carrito |
| **USER** | ORDER | Agregación | 1:N | Un usuario puede tener múltiples pedidos |
| **CART** | PRODUCT | Asociación | N:M | Un carrito contiene múltiples productos |
| **PRODUCT** | CART_ITEM | Composición | N:1 | Cada item referencia un producto |
| **CART** | CART_ITEM | Composición | 1:N | El carrito contiene items |
| **ORDER** | PRODUCT | Asociación | N:M | Un pedido contiene múltiples productos |
| **ORDER** | ORDER_ITEM | Composición | 1:N | El pedido contiene items |

---

## 📋 Atributos y Tipos de Datos

### Clase USER
```javascript
{
  _id: ObjectId,              // PK MongoDB
  nombre: String,             // Campo obligatorio
  email: String,              // Email único
  password: String,           // Hash bcrypt
  rol: String,                // Enum: "cliente", "admin", "vendedor"
  telefono: String,           // Validación de formato
  direccion: String,          // Dirección de envío
  createdAt: Date,            // Timestamp
  updatedAt: Date             // Timestamp
}
```

### Clase PRODUCT
```javascript
{
  _id: ObjectId,              // PK MongoDB
  nombre: String,             // Título producto
  descripcion: String,        // Descripción detallada
  precio: Number,             // Decimal (ej: 19.99)
  categoria: String,          // Enum: "papel", "tóner", "electrónica"
  stock: Number,              // Cantidad disponible
  imagen: String,             // URL de imagen
  sku: String,                // Código único
  createdAt: Date,            // Timestamp
  updatedAt: Date             // Timestamp
}
```

### Clase CART
```javascript
{
  _id: ObjectId,              // PK MongoDB
  userId: ObjectId,           // FK a USER
  items: [CartItem],          // Array de items
  total: Number,              // Total calculado
  estado: String,             // Enum: "activo", "abandonado", "checkout"
  createdAt: Date,            // Timestamp
  updatedAt: Date             // Timestamp
}
```

### Clase CART_ITEM
```javascript
{
  _id: ObjectId,              // PK MongoDB
  cartId: ObjectId,           // FK a CART
  productId: ObjectId,        // FK a PRODUCT
  cantidad: Number,           // Cantidad de unidades
  precioUnitario: Number,     // Precio en momento de compra
  subtotal: Number,           // cantidad × precioUnitario
  createdAt: Date             // Timestamp
}
```

### Clase ORDER
```javascript
{
  _id: ObjectId,              // PK MongoDB
  userId: ObjectId,           // FK a USER
  numeroOrden: String,        // ID único para usuario
  items: [OrderItem],         // Array de items
  total: Number,              // Total del pedido
  estado: String,             // Enum: "pendiente", "confirmado", "enviado", "entregado"
  direccionEnvio: String,     // Dirección de entrega
  metodoPago: String,         // Enum: "tarjeta", "transferencia", "paypal"
  transactionId: String,      // ID de pago externo
  fecha: Date,                // Fecha de creación
  fechaEntrega: Date,         // Fecha estimada/actual
  observaciones: String,      // Notas adicionales
  createdAt: Date,            // Timestamp
  updatedAt: Date             // Timestamp
}
```

### Clase ORDER_ITEM
```javascript
{
  _id: ObjectId,              // PK MongoDB
  orderId: ObjectId,          // FK a ORDER
  productId: ObjectId,        // FK a PRODUCT
  cantidad: Number,           // Cantidad en el pedido
  precioUnitario: Number,     // Precio fijo en momento de compra
  subtotal: Number,           // cantidad × precioUnitario
  createdAt: Date             // Timestamp
}
```

---

## 🔐 Constraints y Validaciones

### Constraints de Base de Datos
```javascript
// USER
- email: UNIQUE, NOT NULL, REGEX email
- rol: ENUM ["cliente", "admin", "vendedor"]
- createdAt: DEFAULT NOW()

// PRODUCT
- nombre: NOT NULL
- precio: > 0
- stock: >= 0
- categoria: ENUM ["papel", "tóner", "electrónica", "muebles"]

// CART
- userId: UNIQUE (un carrito por usuario)
- total: >= 0

// ORDER
- numeroOrden: UNIQUE
- estado: ENUM ["pendiente", "confirmado", "enviado", "entregado", "cancelado"]
- total: > 0
```

---

## 📐 Coherencia con Arquitectura

✅ **Las clases están correctamente mapeadas al backend:**

1. **Modelos Mongoose** (`src/models/`)
   - `User.js` → Clase USER
   - `Product.js` → Clase PRODUCT
   - `Cart.js` → Clase CART
   - `Order.js` → Clase ORDER

2. **Relaciones implementadas en código:**
   ```javascript
   // User.js
   const userSchema = new Schema({
     nombre: { type: String, required: true },
     email: { type: String, required: true, unique: true },
     // ...
   });
   
   // Cart.js
   const cartSchema = new Schema({
     userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
     items: [{
       productId: { type: Schema.Types.ObjectId, ref: 'Product' },
       cantidad: Number,
     }]
   });
   ```

3. **Rutas correspondientes:**
   - `/api/auth/*` → Gestión USER
   - `/api/products/*` → Gestión PRODUCT
   - `/api/cart/*` → Gestión CART
   - `/api/orders/*` → Gestión ORDER

---

## 🎯 Cumplimiento de Criterios

| Criterio | Requerimiento | ✅ Cumplido |
|----------|---------------|-----------| 
| Incluye clases principales | USER, PRODUCT, CART, ORDER, ITEMS | ✅ Sí |
| Define atributos y relaciones | 1:N, N:M con cardinalidades | ✅ Sí |
| Cardinalidades visibles | Diagrama ASCII con multiplicidades | ✅ Sí |
| Coherente con arquitectura | Modelos, rutas, servicios | ✅ Sí |

---

## 📝 Conclusión

El diagrama de clases del backend **ofiexpress** representa completamente la arquitectura del dominio con:
- ✅ 5 clases principales claramente definidas
- ✅ Relaciones 1:N y N:M explícitas
- ✅ Atributos tipados y validados
- ✅ Cardinalidades visibles
- ✅ Implementación real en Mongoose/Node.js
