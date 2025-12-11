# Configuración de Permisos en Strapi

## 🔐 Configurar Permisos Públicos

Para que el frontend pueda acceder a los datos de Strapi, necesitas configurar los permisos públicos.

### Paso 1: Acceder a Configuración de Permisos

1. Inicia Strapi: `npm run dev:backend`
2. Ve a http://localhost:1337/admin
3. Inicia sesión con tu cuenta de administrador
4. Ve a **Settings** (⚙️) en el menú lateral
5. Ve a **Users & Permissions Plugin**
6. Haz clic en **Roles**
7. Haz clic en **Public**

### Paso 2: Habilitar Permisos

Para cada uno de estos Content Types, habilita los siguientes permisos:

#### ✅ Turno
- [x] **find** - Permite buscar/listar turnos
- [x] **findOne** - Permite obtener un turno específico
- [ ] create (opcional, solo si quieres crear turnos desde el frontend)
- [ ] update (opcional, solo si quieres actualizar desde el frontend)
- [ ] delete (no recomendado para público)

#### ✅ Cliente
- [x] **find** - Permite buscar/listar clientes
- [x] **findOne** - Permite obtener un cliente específico
- [ ] create (opcional)
- [ ] update (opcional)
- [ ] delete (no recomendado)

#### ✅ Sucursal
- [x] **find** - Permite buscar/listar sucursales
- [x] **findOne** - Permite obtener una sucursal específica

#### ✅ Cajera
- [x] **find** - Permite buscar/listar cajeras
- [x] **findOne** - Permite obtener una cajera específica

#### ✅ Publicidad
- [x] **find** - Permite buscar/listar publicidades
- [x] **findOne** - Permite obtener una publicidad específica

### Paso 3: Guardar Cambios

1. Haz clic en **Save** en la parte superior derecha
2. Los cambios se aplicarán inmediatamente

---

## 🔑 Crear Token de API (Opcional, para Scripts)

Si quieres usar scripts que inserten datos automáticamente, necesitas crear un token de API:

### Paso 1: Crear Token

1. Ve a **Settings** > **API Tokens**
2. Haz clic en **Create new API Token**
3. Completa el formulario:
   - **Name**: "Seed Script" (o el nombre que prefieras)
   - **Token duration**: Unlimited (o el tiempo que prefieras)
   - **Token type**: Full access
4. Haz clic en **Save**
5. **Copia el token** (solo se muestra una vez)

### Paso 2: Usar el Token

**Opción A: Variable de entorno**

Crea un archivo `.env` en `backend/`:

```env
STRAPI_API_TOKEN=tu_token_aqui
```

**Opción B: Pasar como parámetro**

```bash
STRAPI_API_TOKEN=tu_token node scripts/seed-strapi.js
```

---

## ✅ Verificar que los Permisos Funcionen

### Probar desde el Navegador

Abre estas URLs en tu navegador (deberían funcionar sin autenticación):

- http://localhost:1337/api/sucursales?populate=*
- http://localhost:1337/api/cajeras?populate=*
- http://localhost:1337/api/clientes?populate=*
- http://localhost:1337/api/turnos?populate=*
- http://localhost:1337/api/publicidades?populate=*

Si ves datos JSON, los permisos están configurados correctamente.

### Probar desde el Frontend

1. Abre http://localhost:3000/cajera
2. Deberías ver los turnos cargándose
3. Abre la consola del navegador (F12)
4. No deberías ver errores 401 o 403

---

## 🐛 Solución de Problemas

### Error 401 (Unauthorized)

- Los permisos públicos no están habilitados
- Ve a Settings > Users & Permissions > Roles > Public
- Habilita los permisos necesarios

### Error 403 (Forbidden)

- El Content Type no tiene permisos habilitados
- Verifica que hayas habilitado `find` y `findOne` para ese tipo

### No aparecen los datos

- Verifica que los datos estén publicados en Strapi
- Asegúrate de hacer clic en "Publish" después de crear/editar contenido
- Verifica que los filtros en la URL sean correctos

### El frontend no carga datos

- Verifica que `NEXT_PUBLIC_STRAPI_URL` esté configurado en `.env.local`
- Revisa la consola del navegador para ver errores
- Asegúrate de que Strapi esté corriendo en el puerto 1337

