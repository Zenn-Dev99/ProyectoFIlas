# Fila Suite - Sistema de Gestión de Filas

Sistema completo de gestión de filas con integración de WhatsApp, chatbot y múltiples interfaces para diferentes roles.

## 🔐 Autenticación y Roles

El sistema incluye un sistema de autenticación con tres roles:

- **👑 Jefe General:** Puede ver y gestionar todas las sucursales
- **👔 Jefe de Sucursal:** Puede ver y gestionar solo su sucursal asignada
- **👤 Cajera:** Puede acceder al panel de cajera para gestionar turnos

### Credenciales de Prueba

Consulta el archivo [CREDENCIALES.md](./CREDENCIALES.md) para ver todas las credenciales de acceso.

**Para crear usuarios de prueba:**
```bash
node scripts/crear-usuarios-prueba.js
```

## 🏗️ Estructura del Proyecto

```
fila-suite/
├── backend/          # Strapi CMS (gestión de datos)
│   └── backend/     # Proyecto Strapi
├── frontend/         # Next.js (interfaces de usuario)
└── package.json      # Scripts de ejecución desde raíz
```

## 🚀 Inicio Rápido

### Instalación

Desde la carpeta raíz `fila-suite`, ejecuta:

```bash
npm run install:all
```

Esto instalará las dependencias de:
- Frontend (Next.js)
- Backend (Strapi)
- Raíz (concurrently)

### Desarrollo

Para ejecutar ambos proyectos simultáneamente:

```bash
npm run dev
```

Esto iniciará:
- Frontend en `http://localhost:3000`
- Backend (Strapi) en `http://localhost:1337`

### Ejecutar por separado

**Solo Frontend:**
```bash
npm run dev:frontend
```

**Solo Backend:**
```bash
npm run dev:backend
```

## 📱 Interfaces

### 1. Portal Cliente (`/cliente`)
- Consulta de turno por número de teléfono
- Visualización de posición en fila
- Tiempo estimado de espera

### 2. Panel Cajera (`/cajera`)
- Visualización de turnos pendientes
- Llamar turno actual
- Marcar turno como atendido
- Información del cliente y orden

### 3. Pantalla TV (`/tv`)
- Muestra turno actual en grande
- Carrusel de publicidad automático
- Actualización en tiempo real

## 🤖 Funcionalidades del Chatbot WhatsApp

El chatbot preguntará:
1. **Tipo de servicio**: ¿Retiro o compra?
2. **Número de orden** (si es retiro)
3. **Información del cliente**: nombre, teléfono, email opcional

### Notificaciones Automáticas
- Al crear el turno: número asignado y tiempo estimado
- Cuando falten 10 números: notificación de proximidad
- Al ser llamado: notificación para acercarse

## 📊 Cálculo de Tiempo de Fila

El sistema calcula automáticamente el tiempo promedio basado en:
- Tiempo transcurrido entre turnos atendidos
- Promedio móvil de los últimos N turnos
- Actualización dinámica por sucursal

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Strapi 5 (Headless CMS)
- **WhatsApp**: Twilio API (pendiente configuración)
- **Base de Datos**: SQLite (desarrollo) / PostgreSQL (producción)

## 📝 Próximos Pasos

1. Configurar modelos en Strapi:
   - Turno
   - Cliente
   - Orden
   - Sucursal
   - Publicidad

2. Integrar Twilio para WhatsApp

3. Implementar WebSockets para actualizaciones en tiempo real

4. Configurar autenticación para panel de cajera

5. Implementar sistema de notificaciones push

## 📄 Licencia

ISC

