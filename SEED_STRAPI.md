# Guía para Poblar Strapi con Datos de Prueba

## 📋 Método 1: Usando el Script de Seed (Recomendado)

### Paso 1: Asegúrate de que Strapi esté corriendo

```bash
npm run dev:backend
```

### Paso 2: Ejecuta el script de seed

En otra terminal, desde la carpeta `backend/backend`:

```bash
cd backend/backend
npm run strapi ts:run src/scripts/seed-data.ts
```

O desde la raíz del proyecto:

```bash
cd backend/backend
npx strapi ts:run src/scripts/seed-data.ts
```

### Paso 3: Verifica los datos

Ve al panel de administración de Strapi y verifica que se hayan creado:
- 1 Sucursal
- 3 Cajeras
- 4 Clientes
- 4 Turnos
- 3 Publicidades

---

## 📋 Método 2: Crear Datos Manualmente en Strapi

Si el script no funciona, puedes crear los datos manualmente:

### 1. Crear Sucursal

1. Ve a **Content Manager > Sucursal**
2. Crea nueva entrada:
   - **Nombre**: "Sucursal Principal"
   - **Código**: "SUC-001"
   - **Dirección**: "Av. Principal 123"
   - **Teléfono**: "+56912345678"
   - **Tiempo promedio de atención**: 5
   - **Activa**: ✓
3. Guarda y Publica

### 2. Crear Cajeras

1. Ve a **Content Manager > Cajera**
2. Crea 3 cajeras:

   **Cajera 1:**
   - Nombre: "María González"
   - Código: "CAJ-001"
   - Sucursal: Selecciona "Sucursal Principal"
   - Activa: ✓

   **Cajera 2:**
   - Nombre: "Juan Pérez"
   - Código: "CAJ-002"
   - Sucursal: Selecciona "Sucursal Principal"
   - Activa: ✓

   **Cajera 3:**
   - Nombre: "Ana Martínez"
   - Código: "CAJ-003"
   - Sucursal: Selecciona "Sucursal Principal"
   - Activa: ✓

### 3. Crear Clientes

1. Ve a **Content Manager > Cliente**
2. Crea 4 clientes:

   **Cliente 1:**
   - Nombre: "Carlos Rodríguez"
   - Teléfono: "+56987654321"
   - Email: "carlos@example.com"

   **Cliente 2:**
   - Nombre: "Laura Sánchez"
   - Teléfono: "+56976543210"
   - Email: "laura@example.com"

   **Cliente 3:**
   - Nombre: "Pedro López"
   - Teléfono: "+56965432109"
   - Email: "pedro@example.com"

   **Cliente 4:**
   - Nombre: "Sofía Torres"
   - Teléfono: "+56954321098"
   - Email: "sofia@example.com"

### 4. Crear Turnos

1. Ve a **Content Manager > Turno**
2. Crea 4 turnos:

   **Turno 1:**
   - Número: 1
   - Cliente: Carlos Rodríguez
   - Sucursal: Sucursal Principal
   - Tipo: Retiro
   - Orden ID: "ORD-12345"
   - Estado: En atención
   - Posición en fila: 4
   - Tiempo estimado: 20
   - Cajera: María González
   - Fecha creación: Fecha actual

   **Turno 2:**
   - Número: 2
   - Cliente: Laura Sánchez
   - Sucursal: Sucursal Principal
   - Tipo: Compra
   - Estado: Pendiente
   - Posición en fila: 3
   - Tiempo estimado: 15

   **Turno 3:**
   - Número: 3
   - Cliente: Pedro López
   - Sucursal: Sucursal Principal
   - Tipo: Retiro
   - Orden ID: "ORD-67890"
   - Estado: Pendiente
   - Posición en fila: 2
   - Tiempo estimado: 10

   **Turno 4:**
   - Número: 4
   - Cliente: Sofía Torres
   - Sucursal: Sucursal Principal
   - Tipo: Compra
   - Estado: Pendiente
   - Posición en fila: 1
   - Tiempo estimado: 5

### 5. Crear Publicidades

1. Ve a **Content Manager > Publicidad**
2. Crea 3 publicidades:

   **Publicidad 1:**
   - Título: "Oferta Especial de Verano"
   - Descripción: "Descuentos increíbles en toda la tienda esta semana"
   - Orden: 1
   - Activa: ✓
   - Fecha inicio: Fecha actual
   - Fecha fin: 30 días desde ahora

   **Publicidad 2:**
   - Título: "Nuevos Productos Llegaron"
   - Descripción: "Descubre nuestra nueva colección de productos exclusivos"
   - Orden: 2
   - Activa: ✓
   - Fecha inicio: Fecha actual
   - Fecha fin: 30 días desde ahora

   **Publicidad 3:**
   - Título: "Programa de Fidelidad"
   - Descripción: "Únete a nuestro programa y obtén beneficios exclusivos"
   - Orden: 3
   - Activa: ✓
   - Fecha inicio: Fecha actual
   - Fecha fin: 30 días desde ahora

---

## ✅ Verificar que Todo Funcione

### 1. Verificar Permisos

Asegúrate de que los permisos públicos estén habilitados:

1. Ve a **Settings > Users & Permissions Plugin > Roles > Public**
2. Habilita `find` y `findOne` para:
   - ✅ Turno
   - ✅ Cliente
   - ✅ Sucursal
   - ✅ Cajera
   - ✅ Publicidad
3. Guarda los cambios

### 2. Probar las APIs

Abre tu navegador y prueba estas URLs:

- **Sucursales**: http://localhost:1337/api/sucursales?populate=*
- **Cajeras**: http://localhost:1337/api/cajeras?populate=*
- **Clientes**: http://localhost:1337/api/clientes?populate=*
- **Turnos**: http://localhost:1337/api/turnos?populate=*
- **Publicidades**: http://localhost:1337/api/publicidades?populate=*

### 3. Probar el Frontend

1. Abre el panel de cajera: http://localhost:3000/cajera
2. Deberías ver:
   - Selector de cajeras con las 3 cajeras creadas
   - Turno #1 en "Turno en Atención" (asignado a María González)
   - Turnos 2, 3 y 4 en la lista de pendientes

3. Abre la pantalla TV: http://localhost:3000/tv
   - Deberías ver el turno actual (#1) y el código QR

---

## 🐛 Solución de Problemas

### El script no funciona

Si el script de seed no funciona, usa el método manual. Asegúrate de:
- Que Strapi esté corriendo
- Que los modelos estén creados correctamente
- Que los permisos estén configurados

### No aparecen los datos en el frontend

- Verifica que los permisos públicos estén habilitados
- Revisa la consola del navegador para ver errores
- Asegúrate de que la URL de Strapi sea correcta en `.env.local`

### Error al crear relaciones

- Asegúrate de crear primero la Sucursal
- Luego las Cajeras (asignándolas a la Sucursal)
- Luego los Clientes
- Finalmente los Turnos (asignando Cliente, Sucursal y Cajera)

