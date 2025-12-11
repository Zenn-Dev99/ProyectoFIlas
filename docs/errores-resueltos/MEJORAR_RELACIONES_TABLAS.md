# 🔗 Mejorar Relaciones entre Tablas

## 📊 Relaciones Actuales

### ✅ Relaciones Bien Configuradas:
1. **Sucursal ↔ Cajera**: `oneToMany` / `manyToOne` ✅
2. **Sucursal ↔ Turno**: `oneToMany` / `manyToOne` ✅
3. **Sucursal ↔ Usuario**: `oneToMany` / `manyToOne` ✅
4. **Cliente ↔ Turno**: `oneToMany` / `manyToOne` ✅
5. **Cliente ↔ Orden**: `oneToMany` / `manyToOne` ✅
6. **Cajera ↔ Turno**: `oneToMany` / `manyToOne` ✅

### ⚠️ Relaciones que Necesitan Mejora:

1. **Turno ↔ Orden**: 
   - Actualmente: `ordenId` es un `string`
   - Debería ser: Relación `manyToOne` con `api::orden.orden`

2. **Usuario ↔ Cajera**:
   - Actualmente: No existe relación
   - Debería ser: Relación `oneToOne` (un usuario cajera tiene una cajera asignada)

---

## 🔧 Mejoras Propuestas

### 1. Agregar Relación Turno → Orden

En `backend/src/api/turno/content-types/turno/schema.json`:
- Cambiar `ordenId` (string) por relación `orden` (manyToOne)

### 2. Agregar Relación Usuario → Cajera

En `backend/src/api/usuario/content-types/usuario/schema.json`:
- Agregar relación `cajera` (oneToOne) para usuarios con rol "cajera"

### 3. Agregar Relación Inversa Orden → Turno

En `backend/src/api/orden/content-types/orden/schema.json`:
- Agregar relación `turnos` (oneToMany) para ver todos los turnos de una orden

---

## 📝 Cambios Específicos

### Cambio 1: Turno - Orden (Relación en lugar de string)

**Antes:**
```json
"ordenId": {
  "type": "string"
}
```

**Después:**
```json
"orden": {
  "type": "relation",
  "relation": "manyToOne",
  "target": "api::orden.orden",
  "inversedBy": "turnos"
}
```

### Cambio 2: Usuario - Cajera (Agregar relación)

**Agregar en usuario/schema.json:**
```json
"cajera": {
  "type": "relation",
  "relation": "oneToOne",
  "target": "api::cajera.cajera"
}
```

### Cambio 3: Orden - Turno (Relación inversa)

**Agregar en orden/schema.json:**
```json
"turnos": {
  "type": "relation",
  "relation": "oneToMany",
  "target": "api::turno.turno",
  "mappedBy": "orden"
}
```

---

## ✅ Ventajas de Estas Mejoras

1. **Integridad Referencial**: Las relaciones garantizan que los datos sean consistentes
2. **Queries Más Eficientes**: Strapi puede hacer joins automáticos
3. **Validación Automática**: No se pueden crear turnos con órdenes inexistentes
4. **Populate Automático**: Fácil obtener datos relacionados con `populate=*`
5. **Cascadas**: Posibilidad de configurar eliminación en cascada si es necesario

---

## ⚠️ Nota Importante

Después de hacer estos cambios, necesitarás:
1. Reiniciar Strapi para que detecte los cambios en los schemas
2. Ejecutar migraciones si hay datos existentes
3. Actualizar el código que usa `ordenId` para usar `orden.id` o `orden.numeroOrden`


