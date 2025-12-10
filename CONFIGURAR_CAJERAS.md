# Configuración de Múltiples Cajeras

## 📋 Pasos para Configurar Cajeras en Strapi

### 1. Reiniciar Strapi

Después de agregar el nuevo modelo de Cajera, necesitas reiniciar Strapi para que lo reconozca:

```bash
npm run dev:backend
```

### 2. Crear Cajeras en Strapi

1. Ve a **Content Manager > Cajera**
2. Haz clic en **Create new entry**
3. Completa los campos:
   - **Nombre**: Nombre de la cajera (ej: "María González")
   - **Código**: Código único (ej: "CAJ-001")
   - **Sucursal**: Selecciona la sucursal donde trabaja
   - **Activa**: ✓ (marca como activa)
4. Haz clic en **Save** y luego **Publish**

### 3. Repetir para cada cajera

Crea una entrada por cada cajera que trabaje en la sucursal.

**Ejemplo:**
- Cajera 1: Nombre "María González", Código "CAJ-001"
- Cajera 2: Nombre "Juan Pérez", Código "CAJ-002"
- Cajera 3: Nombre "Ana Martínez", Código "CAJ-003"

### 4. Configurar Permisos

1. Ve a **Settings > Users & Permissions Plugin > Roles > Public**
2. Habilita `find` y `findOne` para:
   - ✅ Cajera
3. Guarda los cambios

## 🎯 Funcionalidades del Sistema Multi-Cajera

### Selector de Cajera
- Al abrir el panel, selecciona qué cajera está usando el sistema
- El sistema recordará la cajera seleccionada durante la sesión

### Asignación de Turnos
- Cuando una cajera "llama" un turno, se le asigna automáticamente
- Los turnos asignados se muestran con un indicador visual

### Vista de Turnos
- **Todos los turnos**: Muestra todos los turnos pendientes de la sucursal
- **Solo mis turnos**: Filtra para mostrar solo los turnos asignados a la cajera actual

### Indicadores Visuales
- Turnos asignados a otra cajera aparecen en amarillo
- Turnos sin asignar aparecen en blanco
- Turno actual en atención aparece destacado en azul

## 💡 Casos de Uso

### Escenario 1: Una sola cajera
- Crea una sola cajera en Strapi
- El sistema funcionará normalmente

### Escenario 2: Múltiples cajeras
- Crea todas las cajeras en Strapi
- Cada cajera selecciona su nombre en el panel
- Los turnos se distribuyen automáticamente cuando se llaman

### Escenario 3: Cajera de respaldo
- Si una cajera necesita ayuda, puede ver todos los turnos
- Puede llamar turnos que no estén asignados
- Puede ver turnos asignados a otras cajeras (aparecen en amarillo)

## 🔄 Flujo de Trabajo

1. **Cajera inicia sesión**: Selecciona su nombre en el selector
2. **Ve turnos pendientes**: Puede ver todos o solo los suyos
3. **Llama turno**: Al hacer clic en "Llamar Turno", se asigna a ella
4. **Atiende cliente**: El turno aparece en "Turno en Atención"
5. **Marca como atendido**: Al terminar, marca el turno como completado
6. **Siguiente turno**: El sistema muestra el siguiente turno disponible

## 📊 Ventajas del Sistema Multi-Cajera

✅ **Distribución equitativa**: Los turnos se asignan automáticamente
✅ **Visibilidad**: Todas las cajeras ven el estado de la fila
✅ **Flexibilidad**: Pueden ayudar entre sí si es necesario
✅ **Trazabilidad**: Se registra qué cajera atendió cada turno
✅ **Estadísticas**: Permite analizar el rendimiento por cajera

## 🐛 Solución de Problemas

### No aparecen cajeras en el selector
- Verifica que hayas creado cajeras en Strapi
- Asegúrate de que las cajeras estén marcadas como "Activa"
- Verifica que los permisos públicos estén habilitados
- Reinicia Strapi si acabas de crear el modelo

### Los turnos no se asignan
- Verifica que hayas seleccionado una cajera en el panel
- Revisa los logs de la consola para ver errores
- Asegúrate de que Strapi esté corriendo

### No puedo ver turnos de otras cajeras
- Desmarca la opción "Solo mis turnos" para ver todos
- Los turnos asignados a otras cajeras aparecen en amarillo

