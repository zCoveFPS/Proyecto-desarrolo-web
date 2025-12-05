# 9. Stack Tecnológico Justificado — 8 pts

## 🛠️ Stack de OfiExpress

### **Stack Seleccionado**

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND                  BACKEND          BASE DE DATOS   │
├─────────────────────────────────────────────────────────────┤
│  • HTML5                   • Node.js         • MongoDB       │
│  • CSS3                    • Express.js      • Mongoose ORM  │
│  • Vanilla JavaScript      • REST API        │              │
│                            • JWT (Auth)      │              │
│                            • bcrypt (Hash)   │              │
└─────────────────────────────────────────────────────────────┘

✅ Tecnologías principales implementadas:
   - Node.js + Express (backend)
   - MongoDB + Mongoose (persistencia)
   - REST API + JSON (comunicación)
   - JWT + bcrypt (seguridad)
```

---

## 📋 Justificación Técnica por Tecnología

### **1. Node.js para Backend**

**¿Por qué Node.js?**

| Criterio | Ventaja | Justificación |
|----------|---------|---------------|
| **Lenguaje unificado** | JavaScript en frontend + backend | Reutilizar conocimientos, librerías compartidas (date-fns, lodash, etc.) |
| **Performance** | V8 engine + event-driven, non-blocking I/O | Manejo eficiente de múltiples conexiones simultáneas de clientes |
| **Escalabilidad horizontal** | Fácil de replicar | Se puede ejecutar múltiples instancias con load balancer (nginx, HAProxy) |
| **Ecosistema NPM** | 2+ millones de paquetes | express, mongoose, jwt, bcrypt, cors disponibles y mantenidos |
| **Tiempo desarrollo** | Framework Express muy simple | Prototipado rápido para MVP (Minimum Viable Product) |
| **Costo infraestructura** | Bajo requerimiento de recursos | Servidor modesto puede soportar 1000+ conexiones |
| **Community** | Muy activa (Stack Overflow, GitHub) | Fácil encontrar soluciones a problemas comunes |

**Alternativas rechazadas:**
- ❌ **Python/Django**: Overkill para aplicación CRUD simple; más lento para I/O intensivo
- ❌ **Java/Spring**: Requiere más memoria, tiempo compilación, overhead innecesario
- ❌ **PHP**: Menos mantenible a largo plazo; legacy en muchos proyectos

---

### **2. Express.js para Framework Web**

**¿Por qué Express?**

```javascript
// Express es minimalista y eficiente
const express = require('express');
const app = express();

app.use(express.json());  // Parser de JSON
app.use(cors());          // CORS automático
app.use(auth);            // Middleware personalizado

app.get('/api/products', (req, res) => {
  // Lógica simple y clara
});

app.listen(5000);  // Listen

// Comparar con frameworks pesados como Nest.js o loopback
// que requieren decoradores, inyección de dependencias, etc.
```

| Aspecto | Express | Alternativas |
|--------|---------|--------------|
| **Curva aprendizaje** | Muy baja (principiantes OK) | Nest.js: moderada; Hapi: media |
| **Tamaño bundle** | 16 KB | Nest.js: 500+ KB |
| **Performance** | ⚡⚡⚡ Excelente | Nest.js: ⚡⚡ Bueno |
| **Documentación** | Excelente | Nest.js: buena; Koa: media |
| **Industria** | De facto estándar Node | Nest.js en crecimiento |

**Instalación y uso:**
```bash
npm install express cors dotenv
npm start  # Servidor corriendo
```

---

### **3. MongoDB para Base de Datos**

**¿Por qué MongoDB?**

**Ventajas de NoSQL Document Store:**

1. **Estructura de datos flexible**
   ```javascript
   // Sin necesidad de migrar schema
   db.users.insert({
     nombre: "Juan",
     email: "juan@example.com",
     telefono: "3001234567"  // Opcional
   });
   
   db.users.insert({
     nombre: "María",
     email: "maria@example.com"
     // Teléfono no es obligatorio
   });
   ```

2. **Datos anidados (embedded documents)**
   ```javascript
   // CART puede contener ITEMS dentro
   db.carts.insert({
     userId: ObjectId("..."),
     items: [
       { productId: ObjectId("..."), cantidad: 2 },
       { productId: ObjectId("..."), cantidad: 1 }
     ]
   });
   ```
   **Con SQL:** Requeriría JOIN complejo entre Carts, CartItems, Products

3. **Rápido desarrollo**
   - No require esquema previo
   - Ideal para iteración rápida y pivots de negocio

4. **Escalabilidad**
   - Replicación built-in
   - Sharding automático
   - Cloud MongoDB Atlas ready

5. **Formato JSON nativo**
   - MongoDB maneja BSON (JSON binario)
   - Serialización trivial en Node.js

**Alternativas rechazadas:**

| BD | Por qué ❌ |
|----|-----------|
| **PostgreSQL** | ACID transacciones overkill; requiere migrations; schema rígido |
| **MySQL** | Similar a PostgreSQL; performance relacional no necesaria aquí |
| **Firebase/Firestore** | Costo puede escalar; vendor lock-in; queries limitadas |

---

### **4. Mongoose ORM**

**¿Por qué Mongoose?**

```javascript
// Mongoose proporciona validación + hooks
const userSchema = new Schema({
  email: { 
    type: String, 
    required: true,        // Validación
    unique: true,          // Índice automático
    match: /.+\@.+\..+/    // Regex validation
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
});

// Pre-hook para hashear password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
```

**Ventajas:**
- ✅ Esquema con validación integrada
- ✅ Relaciones (populate) simplificadas
- ✅ Middleware (pre/post hooks)
- ✅ Métodos personalizados en modelos

---

### **5. REST API + JSON**

**¿Por qué REST?**

```
REST (Representational State Transfer) es el estándar:

GET /api/products              → Obtener lista
GET /api/products/:id          → Obtener detalle
POST /api/products             → Crear
PUT /api/products/:id          → Actualizar
DELETE /api/products/:id       → Eliminar

Verbs HTTP: GET, POST, PUT, DELETE (semántica clara)
Status codes: 200, 201, 400, 404, 500 (estándar)
```

**Comparativas:**

| Protocolo | Caso de uso | Nuestro proyecto |
|-----------|------------|------------------|
| **REST** | CRUD general | ✅ **Ideal** |
| **GraphQL** | Queries complejas + múltiples clients | ❌ Overkill |
| **gRPC** | Microservicios de alta performance | ❌ No necesitamos |
| **WebSockets** | Tiempo real (chat, notificaciones) | ❌ No es requisito |

**JSON es estándar porque:**
- ✅ Legible por humanos
- ✅ Nativo en JavaScript
- ✅ Soportado en todos lados
- ✅ Menor overhead que XML

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439012",
      "cantidad": 2,
      "precio": 9.99
    }
  ],
  "total": 19.98
}
```

---

### **6. JWT para Autenticación**

**¿Por qué JWT?**

```
Request tradicional con sesiones:
  1. Cliente envía usuario/contraseña
  2. Servidor crea sesión en BD
  3. Servidor envía sessionId en cookie
  4. Cliente incluye cookie en cada request
  
  ❌ Problema: Requiere almacenamiento en servidor (no escala)

Request con JWT:
  1. Cliente envía usuario/contraseña
  2. Servidor genera JWT (token firmado)
  3. Cliente almacena JWT en localStorage
  4. Cliente incluye JWT en Authorization header
  
  ✅ Stateless: Servidor NO guarda nada
  ✅ Escalable: Múltiples servidores validan mismo token
  ✅ Móvil-friendly: Funciona con apps nativas
```

**Implementación OfiExpress:**

```javascript
// login endpoint
const token = jwt.sign(
  { userId: user._id },                    // Payload
  process.env.JWT_SECRET,                  // Secret (env var)
  { expiresIn: '7d' }                      // Opciones
);

// Middleware de validación
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
```

---

### **7. bcrypt para Hash de Contraseña**

**¿Por qué bcrypt?**

```javascript
// ❌ NUNCA guardar password en texto plano
db.users.insert({ password: "123456" });  // INSEGURO

// ✅ Usar bcrypt con salt + pepper
const hashedPassword = await bcrypt.hash(password, 10);
// $2b$10$N9qo8uLO... (resultado hash + salt)

// Para validar:
const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
```

**Ventajas bcrypt:**
- ✅ Hashing adaptivo (parámetro cost)
- ✅ Incorpora salt automático
- ✅ Resistente a rainbow tables
- ✅ Lento a propósito (previene brute force)

**Alternativas:**
- ❌ MD5: Obsoleto, reversible con rainbow tables
- ❌ SHA-256: Sin salt, vulnerable
- ✅ argon2: Mejor que bcrypt (pero más pesado)

---

## 🏗️ Contexto Móvil y Escalabilidad

### **Consideración Móvil**

```
┌─────────────────────────────────────────────────────┐
│  POR QUÉ ESTE STACK ES IDEAL PARA MÓVIL             │
└─────────────────────────────────────────────────────┘

1. FRONTEND WEB RESPONSIVO
   ✅ HTML/CSS/JS funciona en cualquier navegador mobile
   ✅ No requiere App Store (deployment inmediato)
   ✅ Escalable a app nativa con React Native/Flutter

2. BACKEND STATELESS (JWT)
   ✅ Perfecto para clientes móviles intermitentes
   ✅ No requiere cookies
   ✅ Funciona con proxies/firewalls restrictivos

3. REST + JSON
   ✅ Minimal bandwidth (comparado con SOAP)
   ✅ Fácil de debuggear con curl/Postman
   ✅ Compatible con cualquier framework móvil

4. MongoDB
   ✅ Replicación automática
   ✅ Puede estar en cloud (Atlas) con alta disponibilidad
   ✅ Escalable horizontalmente
```

**Arquitectura futura Mobile:**

```
┌──────────────┐         ┌──────────────┐
│  App iOS     │ ────┐   │ REST API     │
└──────────────┘     ├──→│ Node.js      │────→ MongoDB
┌──────────────┐     │   └──────────────┘
│  App Android │ ────┤
└──────────────┘     │
┌──────────────┐     │
│  Web Browser │ ────┘
└──────────────┘

Mismo backend + JSON response
Múltiples clientes
```

---

## 🎯 Justificación Orientada a Contexto

### **Contexto de OfiExpress**

**Negocio:**
- 🛒 Tienda virtual de artículos de oficina
- 👥 Usuarios: empleados corporativos, PYMES
- 📱 Acceso desde: web + móviles
- 💰 Presupuesto: Startup (limitado)

**Stack elegido resuelve:**

| Problema | Solución Stack |
|----------|---------|
| Desarrollo rápido | Node.js + Express (time-to-market bajo) |
| Costo infraestructura | MongoDB sin esquema previo (development flexible) |
| Acceso móvil | REST API stateless (JWT sin servidor central) |
| Escalabilidad futura | MongoDB sharding, Node.js replica sets |
| Mantenimiento | Comunidad grande, documentación excelente |
| Single-page apps | JavaScript en frontend y backend (reutilizable) |

---

## 🔄 Alternativas Consideradas

### **Opción A: MEAN Stack (MongoDB, Express, Angular, Node.js)**

| Aspecto | Nuestra elección | MEAN |
|--------|---------|------|
| **Frontend** | Vanilla JS | Angular (framework pesado) |
| **Backend** | Express | Express (✓ igual) |
| **BD** | MongoDB | MongoDB (✓ igual) |
| **Ventaja** | Simple, ligero | Type-safe (TypeScript) |
| **Desventaja** | - | Overkill para proyecto pequeño |

❌ **Rechazado:** Angular añade complejidad innecesaria

---

### **Opción B: LAMP Stack (Linux, Apache, MySQL, PHP)**

| Aspecto | Nuestra elección | LAMP |
|--------|---------|------|
| **Performance** | V8 engine | Apache (más lento) |
| **Lenguaje** | JavaScript (unificado) | PHP (diferente) |
| **BD Relacional** | Flexible (NoSQL) | MySQL (schema rígido) |
| **Desarrollo** | Moderno | Legacy |

❌ **Rechazado:** Arquitectura antigua; inapropiada para 2025

---

### **Opción C: Serverless (AWS Lambda, Firebase)**

| Aspecto | Nuestra elección | Serverless |
|--------|---------|------|
| **Control** | Total (servidor propio) | Limitado (vendor) |
| **Costo** | Bajo (servidor fijo) | Variable (puede escalar) |
| **Latencia** | Baja (siempre activo) | Alta (cold start) |
| **Escalabilidad** | Manual (fácil) | Automática |

❌ **Rechazado para MVP:** Vendor lock-in; costos impredecibles

---

## 📊 Resumen Comparativo

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Criterio     │ Our Stack    │ Alternativa  │ Alternativa  │
│              │ (Node+Mongo) │ (MEAN)       │ (Serverless) │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ Complexity   │ ⭐ Baja      │ ⭐⭐ Media    │ ⭐⭐⭐ Alta   │
│ Performance  │ ⭐⭐⭐ Alto  │ ⭐⭐ Medio    │ ⭐⭐ Medio   │
│ Dev Speed    │ ⭐⭐⭐ Rápido │ ⭐⭐ Medio    │ ⭐ Lento     │
│ Cost         │ ⭐⭐⭐ Bajo  │ ⭐⭐⭐ Bajo   │ ⭐ Variable  │
│ Scalability  │ ⭐⭐⭐       │ ⭐⭐⭐        │ ⭐⭐⭐⭐⭐   │
│ Community    │ ⭐⭐⭐ Huge  │ ⭐⭐ Media    │ ⭐⭐ Media   │
│ Maintenance  │ ⭐⭐⭐ Fácil │ ⭐⭐ Medio    │ ⭐ Difícil   │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

---

## 🎓 Conclusión

**El stack de OfiExpress (Node.js + Express + MongoDB + JWT) es la opción óptima porque:**

✅ **1. Adecuado al tamaño del proyecto:** MVP de tienda virtual, no requiere enterprise stack  
✅ **2. Curva aprendizaje baja:** Ideal para equipos juniors  
✅ **3. Escalabilidad demostrada:** Netflix, Uber, Walmart usan Node.js  
✅ **4. Costo bajo:** Servidor modesto soporta 1000s de usuarios  
✅ **5. Flexible:** MongoDB permite cambios de schema sin migración  
✅ **6. Móvil-friendly:** REST API + JWT es estándar de la industria  
✅ **7. Comunidad activa:** Stack Overflow, npm, GitHub abundantes  
✅ **8. Time-to-market:** Desarrollo rápido, prototipado ágil  

**Proyección futura:**
- 📱 Escalar a app nativa (React Native)
- 🌐 Replicar BD geográficamente
- 🚀 Load balancing con múltiples instancias
- 💳 Integrar payment gateways (Stripe, PayU)
- 📊 Analytics con Google Analytics / Mixpanel
