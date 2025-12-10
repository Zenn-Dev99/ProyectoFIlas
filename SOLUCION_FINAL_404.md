# Solución Final al Error 404 en Actualización de Turnos

## 🔴 Error
```
PUT http://localhost:1337/api/turnos/6 404 (Not Found)
```

## ✅ Solución Definitiva

El problema es que **el permiso `update` no está funcionando correctamente** o **la ruta no está configurada**. Sigue estos pasos EXACTOS:

### Paso 1: Verificar Permisos en Strapi

1. **Abre Strapi Admin**: http://localhost:1337/admin
2. **Ve a Settings** (⚙️) > **Users & Permissions Plugin** > **Roles** > **Public**
3. **Para "Turno"**, verifica que estén marcadas estas casillas:
   - ✅ **find**
   - ✅ **findOne** 
   - ✅ **update** ← **CRÍTICO**
   - ✅ **create** (opcional)

4. **IMPORTANTE**: Desmarca y vuelve a marcar la casilla **update**
5. **Guarda** los cambios (botón "Save" arriba a la derecha)

### Paso 2: Reiniciar Strapi

Después de cambiar los permisos, **DEBES reiniciar Strapi**:

1. Detén Strapi (Ctrl+C en la terminal donde está corriendo)
2. Reinícialo: `npm run dev:backend`

### Paso 3: Verificar que Funcione

1. Abre en el navegador: http://localhost:1337/api/turnos
   - Deberías ver los turnos (permiso `find` funciona)

2. Abre: http://localhost:1337/api/turnos/6
   - Deberías ver el turno #6 (permiso `findOne` funciona)

3. Para probar `update`, usa esta URL en Postman o curl:
   ```bash
   curl -X PUT http://localhost:1337/api/turnos/6 \
     -H "Content-Type: application/json" \
     -d '{"data":{"estado":"en-atencion"}}'
   ```

### Paso 4: Si Sigue Sin Funcionar

Si después de todo esto sigue dando 404, el problema puede ser:

1. **Strapi necesita reiniciarse** después de cambiar permisos
2. **El Content Type no está correctamente configurado**
3. **Hay un problema con la versión de Strapi**

**Solución alternativa**: Usa el panel de Strapi para actualizar manualmente:
- Ve a Content Manager > Turno
- Edita el turno manualmente
- Cambia el estado a "en-atencion"
- Asigna la cajera
- Guarda

## 🔍 Verificación de Permisos

Para verificar que los permisos están correctos, puedes probar en la consola del navegador (F12) en Strapi Admin:

```javascript
// En la consola de Strapi Admin
const role = await strapi.service('plugin::users-permissions.role').findOne(1); // ID 1 es Public
console.log(role.permissions);
```

Esto te mostrará todos los permisos configurados.

## 📝 Nota Final

En Strapi 5, a veces los cambios en permisos requieren:
1. Guardar los cambios
2. Reiniciar Strapi completamente
3. Limpiar la caché del navegador

Si nada de esto funciona, puede ser un bug de Strapi y necesitarías usar autenticación con tokens de API en lugar de permisos públicos.

