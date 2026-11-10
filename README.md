# PayServices 💳

**Aplicación web para la gestión de servicios, facturas y pagos simulados.**

PayServices es un proyecto académico desarrollado como parte de la formación en Ingeniería de Sistemas de Areandina. Su objetivo es implementar una aplicación web que permita administrar clientes, proveedores, servicios, facturas y pagos simulados mediante una arquitectura cliente-servidor.

La aplicación integra un frontend desarrollado con React y TypeScript, un backend construido con Django REST Framework y una base de datos relacional PostgreSQL.

> **Nota:** Los pagos son simulados con fines académicos. La aplicación no realiza transacciones financieras reales ni se conecta con entidades bancarias.

---

## 📸 Vista general

PayServices cuenta con un panel administrativo desde el cual se pueden consultar y gestionar los diferentes recursos del sistema.

**Módulos principales:**
- Dashboard: resumen general de la información.
- Clientes: administración de clientes.
- Proveedores: gestión de proveedores.
- Servicios: administración de servicios ofrecidos.
- Facturas: creación y consulta de facturas.
- Pagos: registro y consulta de pagos simulados.

---

## 🛠️ Tecnologías utilizadas

### Frontend
- React
- TypeScript
- Vite
- Axios

### Backend
- Python
- Django 5.2.19
- Django REST Framework

### Base de datos
- PostgreSQL

---

## 🏗️ Arquitectura del proyecto

El sistema utiliza una arquitectura cliente-servidor. El frontend realiza solicitudes HTTP a la API REST, el backend procesa las operaciones mediante Django REST Framework y Django ORM, y PostgreSQL almacena la información de manera persistente.

```text
PayServices/
│
├── config/
│   └── Configuración principal de Django
│
├── gestion/
│   ├── migrations/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── admin.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── manage.py
└── README.md
```

---

## 🗄️ Modelo de datos

La base de datos está compuesta por cinco entidades principales:

| Entidad | Descripción |
|---|---|
| Cliente | Almacena la información de los clientes. |
| Proveedor | Contiene los datos de los proveedores. |
| Servicio | Registra los servicios ofrecidos por los proveedores. |
| Factura | Almacena las facturas asociadas a clientes y servicios. |
| Pago | Registra los pagos simulados asociados a facturas. |

### Relaciones entre entidades

- Un cliente puede tener varias facturas (1:N).
- Un proveedor puede ofrecer varios servicios (1:N).
- Un servicio puede estar asociado a varias facturas (1:N).
- Una factura puede tener varios pagos (1:N).

El mapeo objeto-relacional se implementa mediante los modelos de Django y sus relaciones `ForeignKey`.

---

## ⚙️ Instalación y configuración

### Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Python 3.13 o compatible.
- Node.js y npm.
- PostgreSQL.
- Git.

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/PayServices.git

cd PayServices
```

### 2. Configurar el backend

Crear y activar un entorno virtual:

**Windows:**

```bash
python -m venv venv

venv\Scripts\activate
```

Instalar las dependencias:

```bash
pip install Django==5.2.19
pip install djangorestframework
pip install "psycopg[binary]"
pip install django-cors-headers
```

### 3. Configurar PostgreSQL

Crear una base de datos llamada:

```sql
CREATE DATABASE payservices_db;
```

Configurar las credenciales de PostgreSQL en `config/settings.py`, dentro de `DATABASES`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'payservices_db',
        'USER': 'TU_USUARIO',
        'PASSWORD': 'TU_CONTRASEÑA',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

> Para un entorno real, las credenciales deben gestionarse mediante variables de entorno y no almacenarse directamente en el repositorio.

### 4. Ejecutar las migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Crear un administrador

```bash
python manage.py createsuperuser
```

### 6. Iniciar el backend

```bash
python manage.py runserver
```

El backend estará disponible en:

```text
http://127.0.0.1:8000/
```

La API estará disponible en:

```text
http://127.0.0.1:8000/api/
```

El administrador de Django estará disponible en:

```text
http://127.0.0.1:8000/admin/
```

---

## 🌐 Configuración y ejecución del frontend

Abrir una segunda terminal y entrar en la carpeta del frontend:

```bash
cd frontend
```

Instalar las dependencias:

```bash
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

El frontend estará disponible normalmente en:

```text
http://localhost:5173/
```

---

## 🔌 Endpoints de la API REST

La API utiliza Django REST Framework para exponer los recursos del sistema.

| Recurso | Endpoint |
|---|---|
| Clientes | `/api/clientes/` |
| Proveedores | `/api/proveedores/` |
| Servicios | `/api/servicios/` |
| Facturas | `/api/facturas/` |
| Pagos | `/api/pagos/` |

### Operaciones disponibles

Los recursos cuentan con operaciones CRUD:

| Método HTTP | Operación |
|---|---|
| GET | Consultar registros |
| POST | Crear registros |
| PATCH | Actualizar parcialmente |
| PUT | Actualizar registros |
| DELETE | Eliminar registros |

Para consultar un registro específico se utiliza su identificador:

```text
GET /api/clientes/1/
```

**Importante:** las rutas individuales terminan en `/`.

---

## 💾 Persistencia de datos

La persistencia se implementa mediante PostgreSQL y el ORM de Django.

Los modelos de Python representan las entidades de la base de datos, mientras que las migraciones permiten crear y actualizar su estructura.

Las operaciones realizadas desde el frontend son procesadas por la API y almacenadas en PostgreSQL.

---

## 🎯 Objetivos académicos

El desarrollo de PayServices permite aplicar los siguientes conceptos:

- Diseño de bases de datos relacionales.
- Identificación de entidades, atributos y relaciones.
- Mapeo objeto-relacional (ORM).
- Integridad referencial mediante claves primarias y foráneas.
- Implementación de operaciones CRUD.
- Desarrollo de API REST.
- Comunicación entre frontend y backend.
- Persistencia de datos en PostgreSQL.

---

## 👨‍💻 Autor

**Yerson Orejuela**

Estudiante de Ingeniería de Sistemas – Areandina.

- GitHub: [@yey10](https://github.com/yey10)
- LinkedIn: [Yerson Orejuela](https://www.linkedin.com/in/yerson-orejuela-056197276/)

---

## 📄 Licencia

Proyecto desarrollado con fines académicos y educativos.
