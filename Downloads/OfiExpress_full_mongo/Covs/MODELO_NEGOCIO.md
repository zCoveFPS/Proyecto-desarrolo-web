# 2. Modelo de Negocio y Segmento de Usuarios — 4 pts

## Segmentación de Usuarios (Jobs-to-be-Done)

### 1. Cliente Minorista (B2C)
- **Perfil**: Pequeños negocios, emprendedores, estudiantes
- **Job to be Done**: "Comprar insumos de oficina de forma rápida, segura y con buen precio"
- **Pains (Dolores)**:
  - Tener que visitar múltiples tiendas físicas
  - Falta de información clara sobre precios y disponibilidad
  - Procesos de compra lentos o complicados
  - No poder seguir pedidos en tiempo real
- **Gains (Ganancias)**:
  - Compra desde cualquier dispositivo (móvil, desktop)
  - Carrito persistente para comparar y decidir
  - Seguimiento automático de pedidos
  - Acceso a ofertas y promociones exclusivas

### 2. Administrador del Sistema
- **Perfil**: Staff de OfiExpress (gerentes, operarios de logística)
- **Job to be Done**: "Gestionar inventario, pedidos y clientes de forma centralizada"
- **Pains**:
  - Gestión manual de stock (inconsistencias)
  - Procesamiento lento de órdenes
  - Falta de reportes de ventas
- **Gains**:
  - Dashboard de ventas y stock en tiempo real
  - Gestión automática de carritos y pedidos
  - Reportes descargables

---

## Modelo de Negocio (Canvas de Osterwalder)

| Componente | Descripción |
|---|---|
| **Propuesta de Valor** | Plataforma de e-commerce especializada en insumos de oficina con carrito persistente, seguimiento de pedidos y múltiples métodos de pago |
| **Segmentos de Cliente** | Pequeñas/medianas empresas, emprendedores, estudiantes, oficinas corporativas |
| **Canales** | Aplicación web responsive (mobile-first), email, redes sociales para marketing |
| **Relación con Cliente** | Soporte por email/WhatsApp, recomendaciones personalizadas, programa de lealtad |
| **Fuentes de Ingresos** | Venta de productos (margen de 15-25%), envíos (costo fijo + distancia), suscripción premium B2B |
| **Recursos Clave** | Infraestructura web (servidor, BD), equipo de desarrollo, inventario, logística |
| **Actividades Clave** | Gestión de catálogo, procesamiento de pagos, fulfillment de órdenes, marketing digital |
| **Alianzas Clave** | Proveedores de insumos de oficina, gateway de pagos (Stripe/WebPay), courier de envíos |
| **Estructura de Costos** | Hosting/infraestructura, nómina de desarrolladores, costo de productos, logística |

### Relación con Necesidades del Usuario Móvil

**Cliente minorista**:
- Acceso desde smartphone durante horarios de trabajo
- Interfaz rápida y responsiva (carga < 3s)
- Confirmación visual clara del carrito (cantidad, total)
- Notificaciones de estado de pedido

**Administrador**:
- Dashboard en tablet para revisar órdenes en almacén
- Búsqueda rápida de inventario
- Actualización de stock en tiempo real

---

## KPIs Iniciales (Validar con datos reales)

1. **Tasa de Conversión**: (Compras / Visitantes) > 2%
2. **Valor Promedio de Orden (AOV)**: > $50.000 CLP
3. **Carrito Abandonado**: < 30%
4. **Tiempo de Entrega Promedio**: 24-48h
5. **Satisfacción del Cliente (NPS)**: > 50