# 4. Historias de Usuario INVEST + 3C + Gherkin — 10 pts

---

## US1: Carrito Persistente por Cuenta (I)

### INVEST Checklist
- **I (Independiente)**: Sí — sin dependencias de otros componentes
- **N (Negociable)**: Sí — detalles implementables con el equipo
- **V (Valiosa)**: Sí — permite que cada usuario guarde su compra
- **E (Estimable)**: Mediana (~8 puntos)
- **S (Small)**: Cabe en un sprint (3-4 días)
- **T (Testeable)**: Sí — API + E2E automatizable

### Card (Resumen)
**Como** usuario registrado  
**Quiero** que mi carrito sea persistente y ligado a mi cuenta  
**Para** poder ver, modificar y comparar mis productos desde cualquier dispositivo sin perder datos

### Conversation (Notas de negocio)
- Cada usuario tiene UN carrito activo (no múltiples)
- El carrito se limpia al confirmar la orden
- Si un producto se elimina del catálogo, el ítem del carrito se marca como "indisponible" pero no se borra
- Validar stock disponible antes de agregar

### Confirmation (Criterios de Aceptación)
- ✓ El carrito se crea automáticamente al agregar el primer ítem
- ✓ Las operaciones (add, update, delete) requieren JWT válido
- ✓ GET `/api/cart/:userId` devuelve items con `product` poblado y `totalCLP` correcto
- ✓ POST `/api/cart/add` incrementa `cantidad` si el producto ya existe (no duplica)
- ✓ POST `/api/cart/update` con `cantidad <= 0` elimina el ítem
- ✓ POST `/api/cart/clear` vacía todo el carrito
- ✓ El total (totalCLP) se recalcula automáticamente en cada cambio

### Gherkin (Escenarios Positivos y Negativos)

```gherkin
Feature: Carrito Persistente por Cuenta
  
  Scenario: Agregar producto al carrito (primer ítem)
    Given un usuario autenticado con ID "user123" y token válido
    And el catálogo contiene un producto "Block de Dibujo" (ID "prod001") con precio $2490 CLP
    When el usuario envía POST /api/cart/add
      | userId    | user123   |
      | productId | prod001   |
      | cantidad  | 2         |
    Then el servidor responde con 200 OK
    And la respuesta contiene un carrito con 1 item
    And el item tiene cantidad=2 y precioUnitCLP=2490
    And totalCLP = 4980
    
  Scenario: Agregar producto existente (incrementa cantidad)
    Given un carrito con 1 item: "Block de Dibujo" x2
    When el usuario agrega el mismo producto con cantidad=3
    Then el carrito ahora tiene 1 item con cantidad=5
    And totalCLP se recalcula correctamente
    
  Scenario: Actualizar cantidad a valor positivo
    Given un carrito con "Block de Dibujo" x5
    When el usuario envía POST /api/cart/update con cantidad=3
    Then el item tiene cantidad=3
    And totalCLP se actualiza
    
  Scenario: Eliminar producto (cantidad <= 0)
    Given un carrito con 2 items
    When el usuario envía POST /api/cart/update con cantidad=0
    Then ese item se elimina del carrito
    And el carrito queda con 1 item
    
  Scenario: Vaciar carrito
    Given un carrito con 3 items
    When el usuario envía POST /api/cart/clear
    Then el carrito queda vacío (items: [])
    And totalCLP = 0
    
  # Escenarios Negativos
  
  Scenario: Agregar sin token (no autenticado)
    Given una solicitud POST /api/cart/add SIN header Authorization
    Then el servidor responde con 401 Unauthorized
    
  Scenario: Producto inexistente
    Given un usuario intenta agregar productId="invalid999"
    When envía POST /api/cart/add
    Then recibe 404 Not Found
    And mensaje de error: "Producto no encontrado"
    
  Scenario: Stock insuficiente
    Given un producto con stock=1 disponible
    When el usuario intenta agregar cantidad=5
    Then recibe 400 Bad Request
    And mensaje: "Stock insuficiente (disponible: 1)"
    
  Scenario: Cantidad inválida (negativa o cero en add)
    Given una solicitud con cantidad=-1 o cantidad=0
    When envía POST /api/cart/add
    Then recibe 400 Bad Request
```

---

## US2: Autenticación (Login/Registro) con Redirección (I)

### INVEST Checklist
- **I**: Sí — no requiere carrito ni catálogo
- **N**: Sí — password y email negociables
- **V**: Sí — crítico para seguridad
- **E**: Pequeña (~5 puntos)
- **S**: Sí
- **T**: Sí

### Card
**Como** usuario nuevo o existente  
**Quiero** registrarme o iniciar sesión de forma segura  
**Para** acceder a mi cuenta, carrito y pedidos personalizados

### Conversation
- Password requiere >= 8 caracteres, 1 mayúscula, 1 número
- Email debe ser único en el sistema
- Después de login, redirigir a `/` (no a catálogo)
- Token JWT válido por 7 días

### Confirmation
- ✓ POST `/api/auth/register` crea usuario y devuelve token + user
- ✓ POST `/api/auth/login` valida credenciales y devuelve token + user
- ✓ Frontend almacena token en localStorage con clave `ofiexpressToken`
- ✓ Frontend almacena userId con clave `ofiexpressUserId`
- ✓ Después del login, redirección a `/` (index.html)
- ✓ Password hasheado con bcrypt (salt >= 10 rounds)

### Gherkin

```gherkin
Feature: Autenticación y Seguridad

  Scenario: Registro exitoso
    Given un formulario de registro vacío
    When el usuario ingresa:
      | nombre   | Juan Pérez        |
      | email    | juan@example.com  |
      | password | SecurePass123     |
    And envía POST /api/auth/register
    Then recibe 201 Created
    And la respuesta contiene token JWT
    And la respuesta contiene user con _id, nombre, email, role="Cliente"
    And el token se puede usar en futuros requests autenticados
    
  Scenario: Login exitoso
    Given un usuario registrado con email "admin@ofi.local" y password "Admin123!"
    When envía POST /api/auth/login con esas credenciales
    Then recibe 200 OK
    And la respuesta contiene token JWT válido
    And la respuesta contiene user con role="Administrador"
    And el frontend almacena token en localStorage
    And el frontend redirige a `/` (home)
    
  Scenario: Email duplicado en registro
    Given un email "duplicado@test.com" ya registrado
    When un usuario intenta registrarse con ese email
    Then recibe 409 Conflict
    And mensaje: "El email ya está registrado"
    
  Scenario: Contraseña débil
    Given un password "weak"
    When intenta registrarse
    Then recibe 400 Bad Request
    And mensaje de validación explícito
    
  Scenario: Credenciales inválidas
    Given email/password incorrectos
    When envía POST /api/auth/login
    Then recibe 401 Unauthorized
    And NO revela si el email existe (por seguridad)
```

---

## US3: Edición de Perfil (I)

### INVEST Checklist
- **I**: Sí — no afecta otras funciones
- **N**: Sí — campos editables
- **V**: Sí — necesario para dirección de envío
- **E**: Pequeña (~3 puntos)
- **S**: Sí
- **T**: Sí

### Card
**Como** usuario registrado  
**Quiero** editar mi perfil (teléfono, dirección)  
**Para** mantener mis datos actualizados para entregas y contacto

### Confirmation
- ✓ GET `/api/users/:id` devuelve todos los campos (nombre, email, teléfono, dirección, rol)
- ✓ PUT `/api/users/:id` actualiza parcialmente (solo los campos enviados)
- ✓ Ambos endpoints requieren JWT válido
- ✓ Usuario solo puede editar su propio perfil (validar :id vs token)

### Gherkin

```gherkin
Feature: Edición de Perfil

  Scenario: Ver perfil completo
    Given un usuario autenticado (ID "user123")
    When envía GET /api/users/user123 con token válido
    Then recibe 200 OK
    And la respuesta incluye: nombre, email, telefono, direccion, role, estado
    
  Scenario: Actualizar teléfono y dirección
    Given un usuario quiere actualizar su perfil
    When envía PUT /api/users/user123 con:
      | telefono   | +56912345678                     |
      | direccion  | Calle Principal 123, Santiago    |
    Then recibe 200 OK
    And los datos se guardan en BD
    And GET /api/users/user123 devuelve los datos actualizados
    
  Scenario: No puede editar perfil de otro usuario
    Given usuario A (ID "user1") con token válido
    When intenta PUT /api/users/user2
    Then recibe 403 Forbidden (si implementa autorización)
```

---

## Matriz de Historias → Épicas

| Historia | Épica | Prioridad | Estado |
|---|---|---|---|
| US1 (Carrito) | E3 | Alta | ✓ Completada |
| US2 (Auth) | E1 | Crítica | ✓ Completada |
| US3 (Perfil) | E1 | Media | ✓ Completada |
| US4 (Checkout) | E4 | Alta | ⏳ Próxima |
| US5 (Seguimiento) | E5 | Media | ⏳ Próxima |

---

## Notas de Implementación

1. **Todos los endpoints protegidos** requieren header: `Authorization: Bearer <token_jwt>`
2. **Validación de entrada** en servidor (nunca confiar en cliente)
3. **Manejo de errores** consistente (mismo formato JSON para todos)
4. **Tests**: Al menos 1 test por escenario Gherkin (+ negativos)
5. **Documentación**: Cada endpoint en Postman/Swagger