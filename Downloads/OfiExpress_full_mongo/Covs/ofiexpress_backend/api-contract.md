# API Contract – OfiExpress REST + MongoDB

Base URL: `http://localhost:4000`

## Registro de usuarios

### POST /api/users/register

Registra un nuevo usuario.

**Body JSON**

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com"
}
```

**Respuestas**

- 201: usuario creado
- 409: email ya existe
- 400: datos incompletos

---

## Productos

### GET /api/products

Obtiene el listado completo de productos.

**Respuesta 200**

```json
[
  {
    "_id": "663....",
    "nombre": "Cuaderno Universitario 100 hojas",
    "descripcion": "Cuaderno tamaño carta, 100 hojas, diferentes diseños.",
    "precioCLP": 1990,
    "categoria": "Cuadernos"
  }
]
```

---

## Carrito

### GET /api/cart/:userId

Obtiene el carrito actual del usuario. Si no existe, se crea vacío.

**Respuesta 200**

```json
{
  "_id": "66...",
  "user": "66...",
  "items": [
    {
      "product": {
        "_id": "66...",
        "nombre": "Cuaderno Universitario 100 hojas",
        "precioCLP": 1990
      },
      "cantidad": 2,
      "precioUnitCLP": 1990
    }
  ],
  "totalCLP": 3980
}
```

### POST /api/cart/add

Agrega un producto al carrito (o aumenta la cantidad).

**Body JSON**

```json
{
  "userId": "66...",
  "productId": "66...",
  "cantidad": 1
}
```

### POST /api/cart/update

Actualiza la cantidad de un producto en el carrito. Si `cantidad <= 0`, se elimina el item.

```json
{
  "userId": "66...",
  "productId": "66...",
  "cantidad": 3
}
```

### POST /api/cart/clear

Vacía el carrito del usuario.

```json
{
  "userId": "66..."
}
```
