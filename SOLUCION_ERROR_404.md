# Solución al Error 404 al Llamar Turno

## 🔴 Error
```
API Error: 404 - {"data":null,"error":{"status":404,"name":"NotFoundError","message":"Not Found","details":{}}}
```

## ✅ Solución

Este error ocurre porque los permisos de **actualización (update)** no están habilitados en Strapi para el Content Type "Turno".

### Pasos para Solucionar:

1. **Abre Strapi Admin**: http://localhost:1337/admin

2. **Ve a Configuración de Permisos**:
   - Settings (⚙️) > Users & Permissions Plugin > Roles > Public

3. **Habilita Permisos para Turno**:
   - Busca "Turno" en la lista
   - Marca las siguientes casillas:
     - ✅ **find** (ya debería estar)
     - ✅ **findOne** (ya debería estar)
     - ✅ **update** ← **ESTE ES EL QUE FALTA**
     - ✅ **create** (opcional, si quieres crear turnos desde el frontend)

4. **Habilita Permisos para Otros Content Types** (si es necesario):
   - **Cliente**: find, findOne, update, create
   - **Cajera**: find, findOne
   - **Sucursal**: find, findOne
   - **Orden**: find, findOne (si quieres ver órdenes)

5. **Guarda los Cambios**:
   - Haz clic en "Save" en la parte superior derecha

6. **Prueba Nuevamente**:
   - Recarga la página del panel de cajera
   - Intenta llamar un turno nuevamente

## 🔍 Verificación

Para verificar que los permisos están correctos, puedes probar la API directamente:

1. Abre en el navegador: http://localhost:1337/api/turnos
   - Deberías ver una lista de turnos (permiso `find` funciona)

2. Abre: http://localhost:1337/api/turnos/1
   - Deberías ver un turno específico (permiso `findOne` funciona)

3. Para probar `update`, necesitas usar una herramienta como Postman o curl, pero si los permisos están bien, el botón "Llamar Turno" debería funcionar.

## 📝 Nota

Si después de habilitar los permisos sigue dando error, verifica:
- Que Strapi esté corriendo correctamente
- Que el turno exista (puedes verificar en Content Manager)
- Que el ID del turno sea correcto
- Revisa la consola del navegador (F12) para más detalles del error

