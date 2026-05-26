# Aplicación de Gestión de Contactos

Aplicación full stack para gestionar contactos. Desarrollada con **Node.js, Express, MySQL y HTML/CSS/JS (Vanilla)**, todo dockerizado para un despliegue rápido y sencillo.

## Requisitos Previos

- Docker y Docker Compose instalados.
- (Opcional) Node.js y MySQL si deseas ejecutarlo localmente sin Docker.

## Estructura del Proyecto

```
contactos-app/
├── backend/            # API REST con Express y Node.js
├── frontend/           # Interfaz de usuario con HTML, CSS, JS
├── init.sql            # Script para inicializar la base de datos
├── docker-compose.yml  # Configuración de los contenedores
└── README.md
```

## Ejecución con Docker (Recomendado)

Esta es la forma más sencilla de levantar la aplicación completa.

1. Abre una terminal en la raíz del proyecto (`contactos-app`).
2. Ejecuta el siguiente comando:

   ```bash
   docker compose up --build
   ```

   O en versiones anteriores de Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. El sistema levantará tres contenedores:
   - **Frontend**: http://localhost:3000
   - **Backend**: http://localhost:5000
   - **Base de Datos**: MySQL en el puerto 3306

### Comandos útiles de Docker

- **Detener los contenedores**: `docker compose stop` o presionar `Ctrl+C` en la terminal.
- **Eliminar los contenedores (conserva los datos)**: `docker compose down`
- **Eliminar contenedores y datos**: `docker compose down -v`

## Ejecución Manual (Sin Docker)

Si prefieres ejecutar el código en tu máquina directamente:

### 1. Base de Datos
- Crea una base de datos MySQL llamada `contactos_db`.
- Ejecuta el contenido del archivo `init.sql` para crear la tabla y agregar datos de prueba.

### 2. Backend
- Ve al directorio `/backend`.
- Crea un archivo `.env` basado en `.env.example` y actualiza los datos de tu base de datos local.
- Instala dependencias: `npm install`
- Inicia el servidor: `npm run dev` (ejecutará en el puerto 5000).

### 3. Frontend
- Puedes abrir el archivo `/frontend/index.html` directamente en tu navegador, o usar un servidor estático simple (como Live Server de VSCode).

## Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (Fetch API).
- **Backend**: Node.js, Express, mysql2, dotenv, cors.
- **Base de Datos**: MySQL 8.0.
- **Infraestructura**: Docker, Docker Compose, Nginx.
