# OfiExpress - Plataforma de E-Commerce de Insumos de Oficina

**Estado**: ✅ Desarrollo completado según rúbrica (Modelo de Negocio, Épicas, INVEST, API Contract, Mockups)

**Servidor**: Activo en `http://localhost:5000`  
**Base de datos**: MongoDB local (`mongodb://127.0.0.1:27017/ofiexpress`)

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Requisitos](#requisitos)
3. [Instalación y Setup](#instalación-y-setup)
4. [Ejecución del Proyecto](#ejecución-del-proyecto)
5. [Documentación de Rúbrica](#documentación-de-rúbrica)
6. [Estructura del Proyecto](#estructura-del-proyecto)
7. [API Endpoints](#api-endpoints-resumen)
8. [Testing](#testing)
9. [Características Implementadas](#características-implementadas)
10. [Próximos Pasos](#próximos-pasos)

---

## Descripción General

**OfiExpress** es una plataforma de e-commerce mobile-first diseñada para la venta de insumos de oficina. Incluye:

- ✅ Autenticación segura (JWT + bcrypt)
- ✅ Catálogo dinámico de productos con categorías
- ✅ Carrito persistente por usuario (ligado a BD)
- ✅ Perfil editable del usuario (teléfono, dirección)
- ✅ Interfaz responsive y atractiva (CSS con animaciones)
- ✅ Backend REST con Node.js/Express
- ✅ Base de datos MongoDB con Mongoose

---

## Requisitos

- **Node.js** 18+
- **npm** 9+
- **Python** 3.8+ (para tests API)
- **MongoDB** ejecutándose localmente en `127.0.0.1:27017`

### Verificar instalaciones

```bash
node --version    # Debe ser v18+
npm --version     # Debe ser 9+
python --version  # Debe ser 3.8+
```

---

## Instalación y Setup

### 1. Clonar el repositorio

```bash
git clone https://github.com/zCoveFPS/Proyecto-desarrolo-web.git
cd Proyecto-desarrolo-web/Downloads/OfiExpress_full_mongo/Covs
```

### 2. Instalar dependencias del backend

```bash
cd ofiexpress_backend
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en `ofiexpress_backend/`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ofiexpress
JWT_SECRET=tu_secret_clave_aqui_minimo_32_caracteres
NODE_ENV=development
```

### 4. Inicializar la BD (opcional - datos de prueba)

Si quieres cargar datos seed:

```bash
npm run seed
```

---

## Ejecución del Proyecto

### Opción A: Modo Desarrollo (Con Nodemon - recarga automática)

```bash
npm run dev
```

### Opción B: Modo Producción

```bash
npm start
```

**Expected Output**:
```
[MongoDB] Conectado a mongodb://127.0.0.1:27017/ofiexpress
Servidor OfiExpress escuchando en http://localhost:5000
```

### Acceder a la aplicación

Abre tu navegador en:
- **Home**: http://localhost:5000/
- **Catálogo**: http://localhost:5000/catalogo.html
- **Carrito**: http://localhost:5000/carrito.html
- **Perfil**: http://localhost:5000/perfil.html

---

## Documentación de Rúbrica

Todos los criterios de la rúbrica están documentados en los siguientes archivos:

### 2. Modelo de Negocio y Segmento de Usuarios — 4 pts
📄 **Archivo**: `MODELO_NEGOCIO.md`

Contiene:
- Segmentación de usuarios (cliente minorista, administrador)
- Jobs-to-be-Done (Pains, Gains)
- Canvas de Osterwalder completo
- Relación con necesidades del usuario móvil
- KPIs iniciales

### 3. Épicas y Objetivos de Negocio — 6 pts
📄 **Archivo**: `EPICAS_OBJETIVOS.md`

Contiene:
- 6 épicas del sistema (Auth, Catálogo, Carrito, Pago, Seguimiento, Admin)
- Objetivos de negocio claros por épica
- KPIs y métricas de éxito
- Timeline recomendado (MVP → Escala)
- Riesgos y mitigación

### 4. Historias de Usuario INVEST + 3C + Gherkin — 10 pts
📄 **Archivo**: `INVEST_STORIES.md`

Contiene:
- 3+ historias escritas bajo estándar **INVEST**
- Cada historia con **Card, Conversation, Confirmation**
- **Escenarios Gherkin** detallados (Given/When/Then)
- Escenarios positivos y negativos
- Matriz historias → épicas

### 5. Mockups GUI Móvil — 4 pts
📄 **Archivo**: `MOCKUPS_MOVILES.html`

Contiene (interactivo, abrir en navegador):
- 6 pantallas móviles principales (Home, Catálogo, Carrito, Checkout, Perfil, Órdenes)
- Flujos de navegación documentados
- Estados del sistema (Pendiente, En Ruta, Entregado, Cancelado)
- Diseño adaptado a dispositivos móviles (UX tácil)

### 6. API Contracts — 6 pts
📄 **Archivo**: `API_CONTRACT_COMPLETO.md`

Contiene:
- Lista completa de endpoints (Auth, Usuarios, Productos, Carrito, Órdenes)
- Método, URL, request/response JSON para cada uno
- Códigos de estado HTTP (200, 201, 400, 401, 404, 409)
- Manejo de errores consistente
- Relación con historias de usuario y mockups

---

## Estructura del Proyecto

```
OfiExpress_full_mongo/Covs/
├── ofiexpress_backend/           # Backend REST (Node.js + Express)
│   ├── src/
│   │   ├── server.js             # Servidor principal
│   │   ├── schema.js             # Esquemas GraphQL (futuro)
│   │   ├── resolvers.js          # Resolvers GraphQL (futuro)
│   │   ├── models/               # Modelos Mongoose
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Cart.js
│   │   │   ├── Order.js
│   │   ├── routes/               # Rutas API
│   │   │   ├── authRoutes.js     # POST /auth/login, /register
│   │   │   ├── userRoutes.js     # GET/PUT /users/:id
│   │   │   ├── productRoutes.js  # GET /products
│   │   │   ├── cartRoutes.js     # GET/POST /cart/*
│   │   │   ├── orderRoutes.js    # POST /orders/create
│   │   ├── middleware/
│   │   │   ├── auth.js           # Middleware de autenticación JWT
│   │   ├── config/
│   │   │   ├── db.js             # Conexión MongoDB
│   │   ├── seed.js               # Datos iniciales
│   ├── package.json
│   ├── .env                      # Variables de entorno
│   ├── node_modules/             # Dependencias
│
├── Html covs/                    # Frontend estático (HTML/CSS/JS)
│   ├── index.html                # Página principal
│   ├── login.html                # Login
│   ├── registro.html             # Registro
│   ├── catalogo.html             # Catálogo de productos
│   ├── carrito.html              # Carrito
│   ├── perfil.html               # Perfil del usuario
│   ├── script.js                 # Lógica JavaScript (API calls, eventos)
│   ├── styles.css                # Estilos CSS (animaciones, responsive)
│
├── test_api.py                   # Tests automatizados de API
│
├── MODELO_NEGOCIO.md             # 2. Modelo de Negocio (4 pts)
├── EPICAS_OBJETIVOS.md           # 3. Épicas y Objetivos (6 pts)
├── INVEST_STORIES.md             # 4. INVEST + 3C + Gherkin (10 pts)
├── MOCKUPS_MOVILES.html          # 5. Mockups GUI (4 pts)
├── API_CONTRACT_COMPLETO.md      # 6. API Contracts (6 pts)
├── README_RUN.md                 # Guía rápida de ejecución
└── README.md                     # Este archivo
```

---

## API Endpoints (Resumen)

### Autenticación
- `POST /api/auth/register` — Registrar nuevo usuario
- `POST /api/auth/login` — Iniciar sesión

### Usuarios
- `GET /api/users/public` — Listar usuarios públicos
- `GET /api/users/:id` — Ver perfil (requiere auth)
- `PUT /api/users/:id` — Editar perfil (requiere auth)

### Productos
- `GET /api/products` — Listar productos
- `GET /api/products/:id` — Detalles de producto

### Carrito
- `GET /api/cart/:userId` — Obtener carrito (requiere auth)
- `POST /api/cart/add` — Agregar producto (requiere auth)
- `POST /api/cart/update` — Actualizar cantidad (requiere auth)
- `POST /api/cart/clear` — Vaciar carrito (requiere auth)

### Órdenes
- `POST /api/orders/create` — Crear orden (requiere auth)

**Documentación completa**: Ver `API_CONTRACT_COMPLETO.md`

---

## Testing

### Ejecutar tests API automatizados

```bash
python test_api.py
```

**Qué se prueba**:
- ✅ Login y registro de usuarios
- ✅ Obtención de productos del catálogo
- ✅ Agregar productos al carrito
- ✅ Actualizar cantidades en carrito
- ✅ Obtener y actualizar perfil de usuario

**Resultado esperado**: Todos los tests pasan (200, 201 OK)

---

## Características Implementadas

### Backend
- ✅ Autenticación JWT segura
- ✅ Hash de contraseñas con bcrypt
- ✅ Modelos Mongoose completos
- ✅ Carrito persistente por usuario
- ✅ Validación de entrada
- ✅ Manejo de errores consistente
- ✅ CORS habilitado

### Frontend
- ✅ Responsive design (mobile-first)
- ✅ 14 animaciones CSS
- ✅ Navbar dinámica (cambia al logearse)
- ✅ Carrito con botones +/- y eliminar
- ✅ Perfil editable
- ✅ Categorías filtradas
- ✅ localStorage para persistencia de token y userId

### Seguridad
- ✅ Passwords hasheadas (bcrypt)
- ✅ JWT con expiración de 7 días
- ✅ Validación en servidor (no confiar en cliente)
- ✅ CORS configurado
- ✅ Middleware de autenticación

---

## Próximos Pasos (Recomendaciones)

### Fase 2: Checkout & Pago
- [ ] Integración con pasarela de pagos (Stripe, WebPay)
- [ ] Validación de dirección de envío
- [ ] Selección de método de pago
- [ ] Confirmación de orden

### Fase 3: Seguimiento & Notificaciones
- [ ] Email de confirmación de pedido
- [ ] Notificaciones de cambio de estado (pending → shipped → delivered)
- [ ] Dashboard de mis órdenes
- [ ] Integración con courier API

### Fase 4: Admin & Reportes
- [ ] Panel de administrador
- [ ] Gestión de inventario
- [ ] Reportes de ventas
- [ ] Estadísticas por período

### Mejoras Técnicas
- [ ] Tests unitarios (Jest)
- [ ] Tests E2E (Playwright, Puppeteer)
- [ ] Rate limiting y throttling
- [ ] Caché Redis para productos
- [ ] CDN para imágenes
- [ ] Compresión gzip
- [ ] Logging centralizado (Winston)

---

## Comandos Útiles

### Backend
```bash
cd ofiexpress_backend
npm run dev          # Modo desarrollo (nodemon)
npm start            # Modo producción (node)
npm run seed         # Cargar datos de prueba
```

### Frontend
```bash
# Abrir en navegador
http://localhost:5000
http://localhost:5000/catalogo.html
http://localhost:5000/carrito.html
http://localhost:5000/perfil.html
```

### Tests
```bash
python test_api.py
```

### Git
```bash
git status
git add .
git commit -m "feat: descripción"
git push origin main
```

---

## Usuarios de Prueba

### Admin
- **Email**: admin@ofi.local
- **Password**: Admin123!
- **Rol**: Administrador

### Cliente de Prueba
Se crea automáticamente al registrarse en la aplicación.

---

## Notas de Configuración

### MongoDB
- **URL Local**: `mongodb://127.0.0.1:27017/ofiexpress`
- **BD**: `ofiexpress`
- **Colecciones**: users, products, carts, orders

### JWT
- **TTL**: 7 días
- **Algorithm**: HS256
- **Secret**: Configurable en `.env`

### Puerto
- **Defecto**: 5000
- **Configurable**: Variable `PORT` en `.env`

---

## Soporte

Para dudas o problemas:
1. Revisa los logs del servidor (`npm run dev`)
2. Ejecuta `python test_api.py` para validar la API
3. Abre DevTools del navegador (F12) para ver errores del cliente
4. Consulta la documentación en:
   - `API_CONTRACT_COMPLETO.md` — endpoints
   - `INVEST_STORIES.md` — funcionalidad esperada
   - `EPICAS_OBJETIVOS.md` — flujos de negocio

---

## Licencia

Proyecto académico para evaluación. Basado en rúbrica de desarrollo web móvil (UNAB).

---

**Última actualización**: Diciembre 5, 2025  
**Estado**: ✅ Completado según rúbrica  
**Versión**: 1.0.0

---

## Checklist Final

- ✅ Servidor backend ejecutándose en `localhost:5000`
- ✅ Frontend servido desde backend
- ✅ Autenticación (login/registro) funcional
- ✅ Carrito persistente por usuario
- ✅ Tests API pasando
- ✅ Documentación de rúbrica completa
- ✅ Cambios commiteados y pusheados a GitHub
- ✅ Código limpio y comentado
- ✅ Responsive design (mobile-first)
- ✅ Manejo de errores consistente

¡Listo para demostración y evaluación! 🚀