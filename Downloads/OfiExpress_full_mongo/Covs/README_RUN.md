Guía rápida: ejecutar el proyecto OfiExpress (backend + pruebas)

Requisitos previos:
- Node.js 18+ y npm
- Python 3.8+ (para el script `test_api.py`)
- MongoDB corriendo localmente en `mongodb://127.0.0.1:27017` (base `ofiexpress`)

Pasos para arrancar backend:
1. Abrir terminal en `ofiexpress_backend`:

```cmd
cd /d c:\Users\Admin\Downloads\OfiExpress_full_mongo\Covs\ofiexpress_backend
```

2. Instalar dependencias (solo la primera vez o si cambia `package.json`):

```cmd
npm install
```

3. Iniciar servidor en modo desarrollo (con `nodemon`) o producción:

```cmd
npm run dev   # nodemon, reinicia al guardar cambios
# o
npm start     # node src/server.js
```

El servidor escucha por defecto en `http://localhost:5000` (puedes cambiar el puerto con la variable de entorno `PORT`).

Frontend (estático):
- El backend sirve la carpeta `Html covs` en la raíz del proyecto. Abre `http://localhost:5000` en tu navegador para ver la app.

Ejecutar pruebas API (script incluido):
1. Asegúrate que el servidor esté corriendo.
2. Desde la raíz del workspace ejecuta:

```cmd
cd /d c:\Users\Admin\Downloads\OfiExpress_full_mongo\Covs
python test_api.py
```

- Este script realiza pruebas de login (admin), creación de usuario, agregar al carrito, actualizar cantidades y editar perfil.

Siguientes pasos recomendados:
- Ejecutar pruebas E2E manuales (abrir navegador e iniciar sesión, agregar productos, abrir carrito y comprobar acciones +/- y eliminar)
- Si encuentras problemas de UI (botones que desaparecen al hacer hover), indicar la página y el botón concreto para que pueda aplicar un ajuste CSS puntual.

Contacto:
- Si quieres que automarice más tareas (commits, documentación completa de endpoints con ejemplos, o creación de mockups), dime qué prefieres que priorice.