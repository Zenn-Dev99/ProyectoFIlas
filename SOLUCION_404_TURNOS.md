# Solución al Error 404 al Actualizar Turnos

## Problema
Al intentar actualizar un turno, aparece el error:
```
PUT http://localhost:1337/api/turnos/8 404 (Not Found)
```

## Diagnóstico
El turno existe y está publicado en Strapi, pero no se puede acceder directamente. Esto indica un problema de **permisos**.

## Solución

### Paso 1: Verificar Permisos en Strapi

1. Abre Strapi Admin: http://localhost:1337/admin
2. Ve a **Settings** (Configuración) en el menú lateral
3. Selecciona **Users & Permissions Plugin** > **Roles**
4. Haz clic en **Public** (rol público)
5. Busca la sección **Turno** (Turn)
6. **Marca las siguientes casillas:**
   - ✅ **find** (para listar turnos)
   - ✅ **findOne** (para obtener un turno específico)
   - ✅ **update** (para actualizar turnos)
   - ✅ **create** (para crear turnos, si es necesario)

### Paso 2: Verificar Permisos de Relaciones

También verifica los permisos para las relaciones:
- **Cliente**: find, findOne, update
- **Cajera**: find, findOne
- **Sucursal**: find, findOne
- **Orden**: find, findOne

### Paso 3: Guardar y Reiniciar

1. Haz clic en **Save** (Guardar) en la parte superior
2. Reinicia Strapi si es necesario:
   ```bash
   # Detén Strapi (Ctrl+C)
   # Luego inicia de nuevo
   npm run dev:backend
   ```

### Paso 4: Verificar que los Turnos Estén Publicados

1. Ve a **Content Manager** > **Turno**
2. Verifica que todos los turnos tengan el estado **Published** (Publicado)
3. Si algún turno está en **Draft** (Borrador), haz clic en **Publish**

## Verificación

Después de configurar los permisos, prueba nuevamente:
1. Recarga la página del panel de cajera
2. Intenta llamar un turno
3. Debería funcionar correctamente

## Nota Importante

Si después de seguir estos pasos el error persiste:
- Verifica que Strapi esté corriendo correctamente
- Revisa la consola del navegador (F12) para más detalles
- Ejecuta el script de diagnóstico: `node scripts/diagnostico-turno.js <turnoId>`
