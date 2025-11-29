# Directrices de Backend para la Vista de Dieta (DietView)

Para soportar la nueva funcionalidad de la vista de Dieta ("Premium Dark Mode" con cálculo de macros en tiempo real), el Backend (GraphQL/API) debe proporcionar la siguiente estructura de datos.

## 1. Modelo de Plan Nutricional (`DietPlan`)

El endpoint que devuelve el plan de dieta (ej. `getDietPlan`) debe incluir los **Objetivos Diarios** y la lista de **Recetas**, además de las comidas habituales.

### Estructura JSON Esperada

```json
{
  "dietPlan": {
    "id": "plan_123",
    "userId": "user_456",
    "name": "Plan de Definición",

    // NUEVO: Objetivos diarios de macros para las barras de progreso
    "dailyTargets": {
      "fats": 70, // Gramos
      "carbs": 250, // Gramos
      "proteins": 180 // Gramos
    },

    // Comidas y Alimentos
    "meals": [
      {
        "name": "Desayuno",
        "foods": [
          {
            "id": "food_1",
            "name": "Tortilla de Claras",
            "amount": 200,
            "unit": "g",

            // NUEVO: Valores nutricionales por la cantidad especificada (para el cálculo en frontend)
            "fatsG": 5,
            "carbsG": 2,
            "proteinsG": 22,

            // NUEVO: Flag para "Alimentos Fijos" vs "Intercambiables"
            "isFixed": true
          },
          {
            "id": "food_2",
            "name": "Avena",
            "amount": 50,
            "unit": "g",
            "fatsG": 3,
            "carbsG": 30,
            "proteinsG": 6,
            "isFixed": false // Aparecerá en la lista de intercambiables (Carbos)
          }
        ]
      }
    ]
  },

  // NUEVO: Lista de Recetas asignadas al usuario
  "recipes": [
    {
      "id": "recipe_1",
      "name": "Pollo al Curry con Arroz Basmati",
      "description": "Una receta deliciosa para...", // Opcional por ahora
      "image": "url_to_image" // Opcional
    },
    {
      "id": "recipe_2",
      "name": "Batido Post-Entreno"
    }
  ]
}
```

## 2. Cambios Específicos Requeridos

### A. Entidad `Food` / `MealItem`

Asegurar que cada ítem de comida devuelva sus macros **calculados para la cantidad asignada**:

- `fatsG` (Int/Float): Gramos de grasa.
- `carbsG` (Int/Float): Gramos de carbohidratos.
- `proteinsG` (Int/Float): Gramos de proteína.
- `isFixed` (Boolean): `true` si es un alimento obligatorio (se muestra en la sección superior con candado), `false` si es una opción intercambiable.

### B. Entidad `DietPlan` o `User`

Agregar los targets diarios totales:

- `dailyTargets`: Objeto con `fats`, `carbs`, `proteins`.

### C. Query de Recetas

Si las recetas no son parte del objeto `DietPlan`, se necesita una query separada:

```graphql
query GetUserRecipes($userId: ID!) {
  recipes(userId: $userId) {
    id
    name
    # Otros campos futuros
  }
}
```

## 3. Lógica de Frontend (Contexto para Backend)

- **Cálculo de Restantes:** El frontend recibe el `dailyTarget` y resta los macros de cada alimento que el usuario marca como "consumido" (`checked`).
- **Clasificación:**
  - Si `isFixed: true` -> Va a la sección "Alimentos Fijos".
  - Si `isFixed: false` -> Se clasifica automáticamente en las pestañas "Grasas", "Carbos" o "Proteínas" basándose en cuál es su macro dominante (lógica ya implementada en el front).

---

**Nota:** Actualmente el frontend está "mockeando" estos datos. Una vez el backend devuelva estos campos, el frontend se conectará automáticamente eliminando los mocks en `src/stores/diet.js`.
