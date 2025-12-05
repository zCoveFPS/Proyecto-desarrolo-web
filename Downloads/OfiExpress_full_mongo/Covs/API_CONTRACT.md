API Contract - OfiExpress (resumen)

Base URL: http://localhost:5000/api

Autenticación
- POST /auth/register
  - Body: { nombre, email, password }
  - Success: 201
  - Response: { token, user }
  - Errors: 400 Bad Request, 409 Email exists

- POST /auth/login
  - Body: { email, password }
  - Success: 200
  - Response: { token, user }
  - Errors: 401 Unauthorized

Usuarios
- GET /users/public (lista pública)
  - Success: 200, array

- GET /users/:id
  - Auth: Bearer token required
  - Success: 200
  - Response: user object (incluye telefono, direccion)
  - Errors: 401, 404

- PUT /users/:id
  - Auth: Bearer token required
  - Body: partial user fields (nombre, telefono, direccion)
  - Success: 200 (returns updated user)
  - Errors: 400, 401, 404

Productos
- GET /products
  - Success: 200, array of products
- GET /products/:id
  - Success: 200

Carrito
- GET /cart/:userId
  - Auth: Bearer token required
  - Success: 200
  - Response: { items: [{ product: {...}, cantidad, precioUnitCLP }], totalCLP }
  - Notes: `product` is populated

- POST /cart/add
  - Auth: Bearer token required
  - Body: { userId, productId, cantidad }
  - Success: 200, returns updated cart
  - Behavior: if item exists, increments cantidad
  - Errors: 400 invalid payload, 401

- POST /cart/update
  - Auth: Bearer token required
  - Body: { userId, productId, cantidad }
  - Success: 200, returns updated cart
  - Behavior: if cantidad <= 0, removes item
  - Errors: 400, 401, 404

- POST /cart/clear
  - Auth: Bearer token required
  - Body: { userId }
  - Success: 200, emptied cart

Órdenes
- POST /orders/create
  - Auth: Bearer token required
  - Body: { userId, items, address, paymentMethod }
  - Success: 201 (order created)

Responses comunes:
- 200 OK: { ... }
- 201 Created: { ... }
- 400 Bad Request: { error: 'message' }
- 401 Unauthorized: { error: 'token invalid' }
- 404 Not Found: { error: 'resource not found' }

Notas de implementación:
- Todos los endpoints protegidos requieren header `Authorization: Bearer <token>`
- Los IDs son ObjectId de MongoDB en string
- `totalCLP` es un virtual calculado por el modelo `Cart`

Recomendaciones:
- Añadir paginación para GET /products
- Documentar ejemplos request/response JSON por endpoint (próxima tarea)