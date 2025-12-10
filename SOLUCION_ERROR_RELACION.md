# Solución: Error de Relación en Strapi

## Error
```
Error on attribute sucursal in model usuario (api::usuario.usuario): 
inversedBy attribute usuarios not found target api::sucursal.sucursal
```

## Solución Aplicada

El error se debía a que en el schema de `Usuario` se había definido `inversedBy: "usuarios"` en la relación `manyToOne`, lo cual es incorrecto.

En Strapi, para relaciones bidireccionales:
- **Lado "many" (Usuario)**: Solo necesita `target` y `relation: "manyToOne"` (sin `inversedBy`)
- **Lado "one" (Sucursal)**: Necesita `mappedBy` para indicar qué campo en el otro modelo apunta a él

## Cambio Realizado

**Antes (incorrecto):**
```json
"sucursal": {
  "type": "relation",
  "relation": "manyToOne",
  "target": "api::sucursal.sucursal",
  "inversedBy": "usuarios"  // ❌ Esto causaba el error
}
```

**Después (correcto):**
```json
"sucursal": {
  "type": "relation",
  "relation": "manyToOne",
  "target": "api::sucursal.sucursal"  // ✅ Sin inversedBy
}
```

El `mappedBy: "sucursal"` ya está correctamente definido en el schema de Sucursal.

## Pasos para Resolver

1. **Reiniciar Strapi:**
   ```bash
   # Detener Strapi (Ctrl+C)
   # Luego reiniciar:
   npm run dev:backend
   ```

2. **Verificar que Strapi inicia correctamente** sin errores

3. **Crear usuarios de prueba:**
   ```bash
   node scripts/crear-usuarios-prueba.js
   ```

4. **Configurar permisos en Strapi:**
   - Ve a `http://localhost:1337/admin`
   - Settings > Users & Permissions Plugin > Roles
   - Selecciona "Public"
   - Busca "Usuario" y habilita:
     - `find` (para listar)
     - `findOne` (para obtener uno específico)

5. **Probar login** en `http://localhost:3000/login`

## Nota

Si el error persiste después de reiniciar, verifica que:
- El schema de Sucursal tenga `mappedBy: "sucursal"` en la relación `usuarios`
- No haya otros errores de sintaxis en los schemas
- Strapi esté completamente detenido antes de reiniciar

