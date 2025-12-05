# 3. Épicas y Objetivos de Negocio — 6 pts

## Épicas del Sistema

### E1: Gestión de Autenticación y Cuenta de Usuario
**Objetivo de Negocio**: Asegurar que solo usuarios legítimos accedan a la plataforma y que cada uno tenga una experiencia personalizada.

**KPIs**:
- Tasa de registro completado: > 80%
- Tasa de abandono en login: < 5%
- Tiempo promedio de login: < 2s

**User Stories (asociadas)**:
- US1.1: Login con email y contraseña
- US1.2: Registro de nuevo usuario (cliente)
- US1.3: Recuperación de contraseña
- US1.4: Editar perfil (teléfono, dirección)

**Procesos Clave**: Validación JWT, hash bcrypt, CORS

---

### E2: Catálogo de Productos y Búsqueda
**Objetivo de Negocio**: Presentar un catálogo atractivo, filtrable y fácil de navegar para aumentar cross-sell y maximizar el tiempo en plataforma.

**KPIs**:
- Productos visualizados por sesión: > 10
- Click-through rate (ver detalle): > 25%
- Categorías utilizadas: >= 5 distintas

**User Stories**:
- US2.1: Ver catálogo completo con paginación
- US2.2: Filtrar por categoría (útiles de escritura, papel, electrónica)
- US2.3: Búsqueda por nombre o código
- US2.4: Ver detalles y fotos del producto

**Procesos Clave**: Índices en BD, filtrado server-side

---

### E3: Carrito de Compra Persistente
**Objetivo de Negocio**: Reducir abandono de carrito permitiendo que usuarios guarden su selección, cambien cantidades y eliminen ítems sin perder datos.

**KPIs**:
- Tasa de carrito abandonado: < 30%
- Tiempo promedio en carrito: 3-5 min
- Conversión carrito → checkout: > 70%

**User Stories**:
- US3.1: Agregar producto al carrito (incrementa cantidad si existe)
- US3.2: Actualizar cantidad directamente en carrito
- US3.3: Eliminar producto del carrito
- US3.4: Ver total y aplicar cupones (futuro)

**Procesos Clave**: BD persistente, validación de stock, cálculo de totales

---

### E4: Procesamiento de Órdenes y Pago
**Objetivo de Negocio**: Convertir carritos en órdenes confirmadas e integrar con pasarelas de pago para capturar ingresos.

**KPIs**:
- Tasa de éxito de pago: > 95%
- Transacciones fraudulentas: < 0.5%
- Tiempo de procesamiento: < 5s

**User Stories**:
- US4.1: Proceder al checkout desde carrito
- US4.2: Validar dirección de envío
- US4.3: Seleccionar método de pago
- US4.4: Confirmar orden y recibir confirmación

**Procesos Clave**: Webhook para confirmación de pago, creación de orden atómica

---

### E5: Seguimiento de Órdenes y Notificaciones
**Objetivo de Negocio**: Mantener a los clientes informados sobre el estado de su pedido (confianza + reducir consultas).

**KPIs**:
- Satisfacción con notificaciones: > 85%
- Reducción de tickets de soporte: -40%

**User Stories**:
- US5.1: Ver estado de órdenes activas
- US5.2: Recibir email de confirmación
- US5.3: Notificación de cambio de estado (envío, entrega)
- US5.4: Descargar factura

**Procesos Clave**: Integración con courier, webhook de estado

---

### E6: Panel de Administrador
**Objetivo de Negocio**: Permitir que el staff gestione inventario, órdenes y reporte sin intervención de desarrolladores.

**KPIs**:
- Tiempo de respuesta a órdenes: < 1h
- Actualización de stock: < 5 min

**User Stories**:
- US6.1: Ver lista de órdenes por estado
- US6.2: Actualizar stock de productos
- US6.3: Generar reporte de ventas por período
- US6.4: Ver lista de clientes y detalles

**Procesos Clave**: Dashboard, filtros avanzados, reportes exportables

---

## Matriz Épicas → Objetivos Negocio

| Épica | Objetivo | Métrica |
|---|---|---|
| E1 (Auth) | Seguridad + Personalización | Tasa de registro > 80% |
| E2 (Catálogo) | Engagement | Productos visualizados > 10/sesión |
| E3 (Carrito) | Conversión | Abandono < 30% |
| E4 (Pago) | Ingresos | Éxito pago > 95% |
| E5 (Seguimiento) | Retención | Satisfacción > 85% |
| E6 (Admin) | Operaciones | Respuesta a órdenes < 1h |

---

## Timeline Recomendado (MVP → Escala)

**Fase 1 (Semana 1-2)**: E1, E2, E3 (auth, catálogo, carrito básico) ✓ COMPLETO  
**Fase 2 (Semana 3-4)**: E4 (checkout y pago) — EN PROGRESO  
**Fase 3 (Semana 5-6)**: E5 (seguimiento) — PRÓXIMA  
**Fase 4 (Semana 7-8)**: E6 (admin) + optimizaciones  

---

## Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Falla en pasarela de pago | Media | Alto | Usar múltiples gateways, reintentos |
| Lentitud en BD bajo carga | Media | Alto | Índices, caché Redis, CDN |
| Fraude en pedidos | Baja | Alto | Validación de dirección, fraud detection |
| Competencia de precios | Alta | Medio | Diferenciación (UX, lealtad) |