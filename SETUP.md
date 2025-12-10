# Guía de Configuración - Fila Suite

## 📋 Pasos de Instalación

### 1. Instalar Dependencias

Desde la carpeta raíz `fila-suite`:

```bash
npm run install:all
```

### 2. Configurar Strapi

1. Inicia Strapi por primera vez:
```bash
npm run dev:backend
```

2. Crea tu cuenta de administrador cuando se abra el navegador

3. Los modelos ya están creados:
   - **Turno**: Gestión de turnos
   - **Cliente**: Información de clientes
   - **Sucursal**: Sucursales del negocio
   - **Publicidad**: Contenido para pantalla TV

4. Configura los permisos en Strapi:
   - Ve a Settings > Users & Permissions Plugin > Roles > Public
   - Habilita `find` y `findOne` para:
     - Turno
     - Cliente
     - Sucursal
     - Publicidad

### 3. Crear Primera Sucursal

En el panel de Strapi:
1. Ve a Content Manager > Sucursal
2. Crea una nueva sucursal:
   - Nombre: "Sucursal Principal"
   - Código: "SUC-001"
   - Tiempo promedio de atención: 5 (minutos)
   - Activa: ✓

### 4. Configurar Variables de Entorno

Crea `.env.local` en `frontend/`:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

Crea `.env` en `backend/backend/` si necesitas configurar la base de datos:

```env
DATABASE_CLIENT=better-sqlite3
DATABASE_FILENAME=.tmp/data.db
```

### 5. Ejecutar el Proyecto

Desde la raíz:

```bash
npm run dev
```

Esto iniciará:
- Frontend: http://localhost:3000
- Backend: http://localhost:1337

## 🔧 Próximos Pasos

1. **Integrar WhatsApp (Twilio)**:
   - Crear cuenta en Twilio
   - Configurar número de WhatsApp
   - Crear webhook en `/api/whatsapp/inbound`

2. **Implementar Lógica de Fila**:
   - Calcular tiempo promedio automáticamente
   - Sistema de notificaciones cuando falten 10 números
   - Actualización en tiempo real con WebSockets

3. **Autenticación**:
   - Implementar login para panel de cajera
   - Proteger rutas administrativas

4. **Mejoras de UI**:
   - Agregar más componentes reutilizables
   - Mejorar diseño responsive
   - Agregar animaciones

## 📚 Recursos

- [Documentación Strapi](https://docs.strapi.io)
- [Documentación Next.js](https://nextjs.org/docs)
- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp)

