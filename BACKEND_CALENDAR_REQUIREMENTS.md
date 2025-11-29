# Guía de Implementación Backend: Calendario y Rutinas

Este documento detalla los requisitos del frontend para el módulo de Calendario y Rutinas, así como la estructura de base de datos sugerida y los datos de ejemplo para los usuarios Victor y Alex.

## 1. Estructura de Base de Datos (Sugerida)

Para soportar la funcionalidad del calendario, necesitamos almacenar la planificación diaria de cada usuario.

### Tablas / Modelos

#### `Workout` (Rutina/Entrenamiento)

Define una rutina específica (ej. "RKO 11").

- `id`: Integer (PK)
- `name`: String (ej. "RKO 11 - Día A")
- `focus`: String (ej. "Pecho y Espalda")
- `description`: Text (Opcional)

#### `DayType` (Tipo de Día - Configuración)

Define los metadatos de los tipos de día (A, B, C, D, Rest).

- `id`: Integer (PK)
- `code`: String (ej. "A", "B", "REST")
- `color`: String (Hex code, ej. "#3B82F6")
- `default_calories`: Integer (ej. 3000)
- `default_steps`: Integer (ej. 10000)

#### `DailyPlan` (Planificación Diaria)

Vincula un usuario con una fecha y su configuración específica.

- `id`: Integer (PK)
- `user_id`: Integer (FK -> Users)
- `date`: Date (YYYY-MM-DD)
- `day_type_id`: Integer (FK -> DayType)
- `workout_id`: Integer (FK -> Workout, Nullable si es descanso)
- `calories_target`: Integer (Puede sobreescribir el default)
- `steps_target`: Integer (Puede sobreescribir el default)
- `status`: String (ej. "pending", "completed", "skipped")
- `feedback_sensation`: String (Opcional, ej. "Good")
- `feedback_recovery`: String (Opcional, ej. "High")

---

## 2. API Endpoints (GraphQL / REST)

El frontend espera poder consultar rangos de fechas (para mes/semana) y detalles de un día específico.

### A. Obtener Calendario (Mes/Rango)

**Query:** `getCalendar(userId: ID!, startDate: Date!, endDate: Date!)`
**Respuesta Esperada (JSON):**

```json
[
  {
    "date": "2025-12-15",
    "dayType": "A",
    "color": "#3B82F6",
    "workoutIcon": "dumbbell", // Mapeado en frontend o backend
    "isCompleted": false
  },
  ...
]
```

### B. Obtener Detalle del Día

**Query:** `getDayDetail(userId: ID!, date: Date!)`
**Respuesta Esperada (JSON):**

```json
{
  "date": "2025-12-15",
  "dayType": "DÍA A",
  "calories": 3000,
  "steps": 8000,
  "workout": {
    "id": 1,
    "name": "RKO 11 – Día A",
    "focus": "Enfoque Pecho y Espalda"
  },
  "feedback": {
    "sensation": "Buena",
    "recovery": "Alta"
  }
}
```

### C. Actualizar Planificación (Drag & Drop)

**Mutation:** `updateDailyPlan(userId: ID!, date: Date!, input: DailyPlanInput!)`

---

## 3. Datos de Ejemplo (Seeding)

A continuación, los scripts (conceptuales) para generar las rutinas de **Victor** y **Alex**.

### Usuario: Victor (Objetivo: Hipertrofia / Volumen)

_Asumimos User ID: 1_

**Configuración de Tipos de Día:**

- **Día A (Pecho/Espalda):** 3000 kcal, 8000 pasos.
- **Día B (Piernas):** 3200 kcal, 10000 pasos.
- **Día C (Brazos/Hombro):** 2800 kcal, 8000 pasos.

**Rutinas:**

1. "RKO 11 - Día A" (Pecho/Espalda)
2. "RKO 12 - Día B" (Piernas)

**Planificación Diciembre 2025 (Ejemplo Semana 15-21):**

- **15 Dic (Lun):** Día A
- **16 Dic (Mar):** Día B
- **17 Dic (Mie):** Día C
- **18 Dic (Jue):** Día A
- **19 Dic (Vie):** Día B
- **20 Dic (Sab):** Descanso
- **21 Dic (Dom):** Día C

### Usuario: Alex (Objetivo: Definición / Rendimiento)

_Asumimos User ID: 2_

**Configuración de Tipos de Día:**

- **Día A (Full Body):** 2500 kcal, 12000 pasos.
- **Día B (Cardio/Abs):** 2200 kcal, 15000 pasos.

**Rutinas:**

1. "Metcon 1 - Full Body"
2. "Endurance - Run & Core"

**Planificación Diciembre 2025 (Ejemplo Semana 15-21):**

- **15 Dic (Lun):** Día A
- **16 Dic (Mar):** Día B
- **17 Dic (Mie):** Día A
- **18 Dic (Jue):** Día B
- **19 Dic (Vie):** Día A
- **20 Dic (Sab):** Día B
- **21 Dic (Dom):** Descanso

---

## 4. Integración Frontend

Actualmente, el frontend (`StudentCalendarDay.vue`) está "mockeando" estos datos. Para conectar:

1.  Crear un Store de Pinia (`useCalendarStore`).
2.  Implementar la acción `fetchMonth(year, month)` que llame a la API.
3.  Implementar la acción `fetchDay(date)` que llame a la API.
4.  Reemplazar los objetos `computed` en los componentes Vue con los datos del Store.
