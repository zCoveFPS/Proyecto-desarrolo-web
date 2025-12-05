# 6. API Contracts — 6 pts

Base URL: `http://localhost:5000/api`  
Autenticación: Header `Authorization: Bearer <JWT_TOKEN>`

---

## 1. Autenticación

### POST /auth/register
Registra un nuevo usuario y devuelve token.

**Request**:
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "SecurePass123"
}
```

**Success Response (201 Created)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "role": "Cliente",
    "estado": "Activo",
    "telefono": "",
    "direccion": "",
    "createdAt": "2025-12-05T22:27:47.271Z"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Validación fallida (campos faltantes, password débil)
  ```json
  { "error": "Password debe tener al menos 8 caracteres y 1 mayúscula" }
  ```
- `409 Conflict`: Email ya registrado
  ```json
  { "error": "El email ya está registrado" }
  ```

---

### POST /auth/login
Autentica un usuario con email y contraseña.

**Request**:
```json
{
  "email": "admin@ofi.local",
  "password": "Admin123!"
}
```

**Success Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "6933423ed7fb431e24e3a0dd",
    "nombre": "Admin",
    "email": "admin@ofi.local",
    "role": "Administrador",
    "estado": "Activo",
    "telefono": "+56912345678",
    "direccion": "Calle Principal 123, Santiago"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Credenciales inválidas
  ```json
  { "error": "Email o contraseña incorrectos" }
  ```

---

## 2. Usuarios

### GET /users/public
Devuelve lista pública de usuarios (sin info sensible).

**Request**: GET `/api/users/public`

**Success Response (200 OK)**:
```json
[
  {
    "_id": "6933423ed7fb431e24e3a0dd",
    "nombre": "Admin",
    "email": "admin@ofi.local",
    "role": "Administrador"
  },
  {
    "_id": "69335c63ad3a72f9612bbc7b",
    "nombre": "Usuario Prueba",
    "email": "prueba@example.com",
    "role": "Cliente"
  }
]
```

---

### GET /users/:id
Obtiene perfil completo del usuario (requiere autenticación).

**Request**: GET `/api/users/6933423ed7fb431e24e3a0dd`  
**Headers**: `Authorization: Bearer <TOKEN>`

**Success Response (200 OK)**:
```json
{
  "_id": "6933423ed7fb431e24e3a0dd",
  "nombre": "Admin",
  "email": "admin@ofi.local",
  "role": "Administrador",
  "estado": "Activo",
  "telefono": "+56912345678",
  "direccion": "Calle Principal 123, Santiago",
  "createdAt": "2025-12-05T20:36:14.234Z",
  "updatedAt": "2025-12-05T21:08:15.482Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Sin token o token inválido
- `404 Not Found`: Usuario no existe

---

### PUT /users/:id
Actualiza parcialmente los datos del usuario.

**Request**: PUT `/api/users/6933423ed7fb431e24e3a0dd`  
**Headers**: `Authorization: Bearer <TOKEN>`  
**Body**:
```json
{
  "nombre": "Admin Actualizado",
  "telefono": "+56987654321",
  "direccion": "Nueva Calle 456, Valparaíso"
}
```

**Success Response (200 OK)**:
```json
{
  "_id": "6933423ed7fb431e24e3a0dd",
  "nombre": "Admin Actualizado",
  "email": "admin@ofi.local",
  "role": "Administrador",
  "telefono": "+56987654321",
  "direccion": "Nueva Calle 456, Valparaíso"
}
```

**Error Responses**:
- `400 Bad Request`: Datos inválidos
- `401 Unauthorized`: Sin autenticación
- `404 Not Found`: Usuario no existe

---

## 3. Productos

### GET /products
Devuelve lista de todos los productos.

**Request**: GET `/api/products` o con query params:
- GET `/api/products?categoria=papel`
- GET `/api/products?pagina=2&limite=10`

**Success Response (200 OK)**:
```json
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "nombre": "Block de Dibujo",
    "descripcion": "Block de papel para dibujo profesional",
    "precioCLP": 2490,
    "stock": 50,
    "categoria": "papel",
    "imagen": "/uploads/block-dibujo.jpg",
    "createdAt": "2025-12-01T10:00:00Z"
  },
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "nombre": "Bolígrafo BIC Azul",
    "precioCLP": 890,
    "stock": 200,
    "categoria": "escritura"
  }
]
```

---

### GET /products/:id
Obtiene detalles de un producto específico.

**Request**: GET `/api/products/65a1b2c3d4e5f6g7h8i9j0k1`

**Success Response (200 OK)**:
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "nombre": "Block de Dibujo",
  "descripcion": "Block de papel para dibujo profesional A4",
  "precioCLP": 2490,
  "stock": 50,
  "categoria": "papel",
  "imagen": "/uploads/block-dibujo.jpg",
  "createdAt": "2025-12-01T10:00:00Z"
}
```

**Error Response**: `404 Not Found`

---

## 4. Carrito

### GET /cart/:userId
Obtiene el carrito del usuario.

**Request**: GET `/api/cart/69335c63ad3a72f9612bbc7b`  
**Headers**: `Authorization: Bearer <TOKEN>`

**Success Response (200 OK)**:
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
  "userId": "69335c63ad3a72f9612bbc7b",
  "items": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
      "product": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "nombre": "Block de Dibujo",
        "precioCLP": 2490
      },
      "cantidad": 2,
      "precioUnitCLP": 2490
    }
  ],
  "totalCLP": 4980,
  "createdAt": "2025-12-05T20:00:00Z"
}
```

---

### POST /cart/add
Agrega un producto al carrito (o incrementa cantidad si existe).

**Request**: POST `/api/cart/add`  
**Headers**: `Authorization: Bearer <TOKEN>`  
**Body**:
```json
{
  "userId": "69335c63ad3a72f9612bbc7b",
  "productId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "cantidad": 2
}
```

**Success Response (200 OK)**:
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
  "userId": "69335c63ad3a72f9612bbc7b",
  "items": [
    {
      "product": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "nombre": "Block de Dibujo",
        "precioCLP": 2490
      },
      "cantidad": 2,
      "precioUnitCLP": 2490
    }
  ],
  "totalCLP": 4980
}
```

**Error Responses**:
- `400 Bad Request`: Validación fallida
  ```json
  { "error": "Cantidad debe ser > 0" }
  ```
- `401 Unauthorized`: Sin token
- `404 Not Found`: Producto no existe

---

### POST /cart/update
Actualiza la cantidad de un producto en el carrito (elimina si cantidad <= 0).

**Request**: POST `/api/cart/update`  
**Headers**: `Authorization: Bearer <TOKEN>`  
**Body**:
```json
{
  "userId": "69335c63ad3a72f9612bbc7b",
  "productId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "cantidad": 5
}
```

**Success Response (200 OK)**:
```json
{
  "items": [
    {
      "product": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "nombre": "Block de Dibujo",
        "precioCLP": 2490
      },
      "cantidad": 5,
      "precioUnitCLP": 2490
    }
  ],
  "totalCLP": 12450
}
```

**Nota**: Si `cantidad <= 0`, el ítem se elimina.

---

### POST /cart/clear
Vacía completamente el carrito del usuario.

**Request**: POST `/api/cart/clear`  
**Headers**: `Authorization: Bearer <TOKEN>`  
**Body**:
```json
{
  "userId": "69335c63ad3a72f9612bbc7b"
}
```

**Success Response (200 OK)**:
```json
{
  "items": [],
  "totalCLP": 0
}
```

---

## 5. Órdenes (Básico - A expandir)

### POST /orders/create
Crea una orden a partir del carrito.

**Request**: POST `/api/orders/create`  
**Headers**: `Authorization: Bearer <TOKEN>`  
**Body**:
```json
{
  "userId": "69335c63ad3a72f9612bbc7b",
  "direccionEnvio": "Calle Principal 123, Santiago",
  "metodoPago": "tarjeta"
}
```

**Success Response (201 Created)**:
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k7",
  "userId": "69335c63ad3a72f9612bbc7b",
  "items": [
    {
      "product": "65a1b2c3d4e5f6g7h8i9j0k1",
      "cantidad": 2,
      "precioUnitCLP": 2490
    }
  ],
  "totalCLP": 4980,
  "estado": "Pendiente de Pago",
  "metodoPago": "tarjeta",
  "direccionEnvio": "Calle Principal 123, Santiago",
  "createdAt": "2025-12-05T22:30:00Z"
}
```

---

## Códigos de Estado HTTP Generales

| Código | Significado | Caso |
|---|---|---|
| 200 | OK | GET exitoso, POST exitoso (actualización) |
| 201 | Created | POST de creación exitosa (recurso nuevo) |
| 400 | Bad Request | Validación fallida, formato JSON inválido |
| 401 | Unauthorized | Sin token o token expirado |
| 403 | Forbidden | Autorización insuficiente (no es su recurso) |
| 404 | Not Found | Recurso no existe |
| 409 | Conflict | Email duplicado, stock insuficiente |
| 500 | Internal Server Error | Error del servidor |

---

## Manejo de Errores (Consistente)

Todos los errores siguen este formato:

```json
{
  "error": "Descripción clara del problema",
  "codigo": "ERROR_CODE_OPCIONAL",
  "detalles": { }
}
```

### Ejemplos

**Sin token**:
```json
{ "error": "Token no proporcionado o inválido" }
```

**Producto inexistente**:
```json
{ "error": "Producto no encontrado", "codigo": "PRODUCT_NOT_FOUND" }
```

**Stock insuficiente**:
```json
{ "error": "Stock insuficiente", "detalles": { "disponible": 1, "solicitado": 5 } }
```

---

## Headers Requeridos

Todos los endpoints protegidos requieren:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## Notas de Implementación

1. **Validación de entrada**: Todas las peticiones validan tamaño, tipo y rango de datos
2. **Seguridad**: Passwords nunca se devuelven en respuestas
3. **Tokens JWT**: TTL = 7 días, firma con secret en `.env`
4. **CORS**: Habilitado para `http://localhost:3000` y `http://localhost:5000`
5. **Rate Limiting**: A implementar en producción (máx 100 req/min por IP)

---

## Testing

Usa el script `test_api.py` incluido en la raíz del proyecto para ejecutar pruebas E2E:

```bash
python test_api.py
```

Se prueban: login, registro, catálogo, carrito (add/update/delete), perfil, órdenes.