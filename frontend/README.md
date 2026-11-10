# PayServices · Frontend

Panel administrativo para la gestión y el pago (simulado) de servicios.
React 19 + TypeScript + Vite + Axios. Consume la API REST de Django.

## Ejecutar

```bash
npm install
npm run dev
```

El backend debe estar en `http://127.0.0.1:8000/api/`. Para cambiarlo, crea un `.env`:

```
VITE_API_URL=http://127.0.0.1:8000/api/
```

> Django debe permitir el origen del frontend (CORS), normalmente `http://localhost:5173`.

## Estructura

```
src/
├── config/        api.ts (URL base) · resources.ts (campos de cada modelo) · navigation.ts
├── services/      http.ts (Axios) · crud.ts (CRUD genérico) · errors.ts (mensajes de error)
├── hooks/         useResource · useLists · useHashRoute
├── components/    Sidebar, Modal, ResourceForm, DataTable, ResourcePage, toast/…
├── pages/         Dashboard y una página por recurso
└── utils/         formato, textos de celda y construcción del payload
```

## Ajustar campos

Los campos de cada modelo (alineados con `models.py` y `serializers.py`) están en un solo archivo:
`src/config/resources.ts`. Si alguno no coincide con el serializer de Django,
cámbialo ahí: la tabla, el formulario y el dashboard se actualizan solos.
