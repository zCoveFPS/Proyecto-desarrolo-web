# OfiExpress – Entrega Backend (Caso 37)
**Contenido**: Diagrama de Clases (Mermaid) + Código API (GraphQL con Node.js + Apollo Server).

## Requisitos
- Node.js 18+
- npm

## Instalación
```bash
npm install
npm run dev
```
Servidor en: `http://localhost:4000/graphql`

## Estructura
```
ofiexpress-backend/
├─ README.md
├─ diagramas/
│  └─ class-diagram.mmd   # Abrir y copiar en https://mermaid.live
├─ package.json
├─ src/
│  ├─ index.js            # Bootstrap del servidor
│  ├─ schema.js           # TypeDefs (SDL)
│  └─ resolvers.js        # Resolvers en memoria
└─ data/
   └─ seed.json           # Datos de ejemplo (papelería)
```

## Notas
- El modelo incorpora variantes de producto (color/tamaño/SKU), listas escolares, cliente empresa y despacho/retira.
- Los datos están en memoria para facilitar la corrección; no requiere DB.
- El código está comentado en **español** y pensado para alumnos con nivel básico/intermedio.
