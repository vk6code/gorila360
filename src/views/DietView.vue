<script setup>
import { ref, computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useAuth } from '@/stores/auth'

// --- 1. Define la consulta GraphQL ---
// Actualizado para usar el ID del usuario autenticado
const GET_DIET_PLAN = gql`
  query GetUserDietPlan($userId: ID!) {
    me {
      name
    }
    dietPlan(userId: $userId) {
      name
      meals {
        name
        foods {
          amount
          unit
          food {
            name
            proteinsG
            fatsG
            carbsG
          }
        }
      }
    }
  }
`

// --- 2. Ejecuta la consulta ---
const { user } = useAuth()
// Intentamos obtener el ID del usuario desde el token (sub o id), fallback a "1" si no existe
const userId = computed(() => user.value?.sub || user.value?.id || "1")

const { result, loading, error } = useQuery(GET_DIET_PLAN, () => ({
  userId: userId.value
}))

// --- 3. Lógica de Adaptación (Opción B) ---
// Aplanamos la estructura jerárquica (Plan -> Comidas -> Alimentos)
// para mantener el diseño visual por macros.

const allFoods = computed(() => {
  if (!result.value?.dietPlan?.meals) return []
  return result.value.dietPlan.meals.flatMap(meal => meal.foods)
})

// Filtra alimentos ricos en GRASAS
// Criterio: más de 5g de grasa
const fatsPlanned = computed(() => {
  return allFoods.value
    .filter(item => item.food.fatsG > 5)
    .map(item => ({
      name: item.food.name,
      amount: `${item.amount} ${item.unit}`
    }))
})

// Filtra alimentos ricos en CARBOHIDRATOS
// Criterio: más de 10g de carbohidratos
const carbsPlanned = computed(() => {
  return allFoods.value
    .filter(item => item.food.carbsG > 10)
    .map(item => ({
      name: item.food.name,
      amount: `${item.amount} ${item.unit}`
    }))
})

// Filtra alimentos ricos en PROTEINAS
// Criterio: más de 5g de proteína
const proteinsPlanned = computed(() => {
  return allFoods.value
    .filter(item => item.food.proteinsG > 5)
    .map(item => ({
      name: item.food.name,
      amount: `${item.amount} ${item.unit}`
    }))
})

const userName = computed(() => user.value?.name || result.value?.me?.name || 'Usuario')

// --- 4. Estado para controlar la visibilidad de las listas ---
const showFats = ref(false)
const showCarbs = ref(false)
const showProteins = ref(false)
</script>

<template>
  <div class="flex flex-col p-6 font-display text-text-primary">
    <h1 class="text-heading-lg font-bold text-accent-primary mb-6">
      Dieta
    </h1>

    <!-- Estado de carga -->
    <div v-if="loading" class="mt-4 text-text-secondary animate-pulse">
      Cargando plan nutricional...
    </div>

    <!-- Estado de error -->
    <div v-if="error" class="mt-4 rounded-xl bg-red-900/20 border border-red-900/50 p-4 text-red-400">
      <h3 class="font-bold flex items-center gap-2">
        <span class="material-symbols-outlined">error</span>
        Error de Conexión
      </h3>
      <p class="text-sm mt-2 text-red-300/80">No se pudo cargar el plan de dieta.</p>
      <pre class="mt-3 whitespace-pre-wrap rounded bg-black/30 p-3 text-xs text-red-300 font-mono border border-red-900/30">{{ error.message }}</pre>
    </div>

    <!-- Contenido principal cuando los datos están listos -->
    <div v-if="result && result.dietPlan" class="mt-2">
      <h2 class="text-heading-md font-semibold text-white mb-6">
        Hola, <span class="text-accent-primary">{{ userName }}</span>, este es tu plan nutricional!
      </h2>

      <div class="space-y-4">
        <!-- Botón de Grasas -->
        <div class="overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#151515]">
          <button
            class="flex w-full items-center justify-between px-5 py-4 text-left font-bold text-white transition-all hover:bg-[#1F1F1F] active:bg-[#252525]"
            @click="showFats = !showFats"
          >
            <span class="flex items-center gap-3">
              <span class="material-symbols-outlined text-accent-primary">water_drop</span>
              Grasas
            </span>
            <span
              class="material-symbols-outlined transition-transform duration-300 text-gray-500"
              :class="{ 'rotate-180': showFats }"
            >
              expand_more
            </span>
          </button>
          <div v-show="showFats" class="border-t border-[#2A2A2A] bg-[#0E0E0E] p-5 transition-all">
            <ul class="space-y-3">
              <li v-for="(fat, index) in fatsPlanned" :key="index" class="flex justify-between text-sm text-gray-300 border-b border-[#1F1F1F] pb-2 last:border-0 last:pb-0">
                <span>{{ fat.name }}</span>
                <strong class="text-accent-primary">{{ fat.amount }}</strong>
              </li>
              <li v-if="fatsPlanned.length === 0" class="text-xs text-gray-500 italic">
                No hay alimentos altos en grasas en este plan.
              </li>
            </ul>
          </div>
        </div>

        <!-- Botón de Carbohidratos -->
        <div class="overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#151515]">
          <button
            class="flex w-full items-center justify-between px-5 py-4 text-left font-bold text-white transition-all hover:bg-[#1F1F1F] active:bg-[#252525]"
            @click="showCarbs = !showCarbs"
          >
            <span class="flex items-center gap-3">
              <span class="material-symbols-outlined text-accent-primary">grain</span>
              Carbohidratos
            </span>
            <span
              class="material-symbols-outlined transition-transform duration-300 text-gray-500"
              :class="{ 'rotate-180': showCarbs }"
            >
              expand_more
            </span>
          </button>
          <div v-show="showCarbs" class="border-t border-[#2A2A2A] bg-[#0E0E0E] p-5 transition-all">
            <ul class="space-y-3">
              <li v-for="(carb, index) in carbsPlanned" :key="index" class="flex justify-between text-sm text-gray-300 border-b border-[#1F1F1F] pb-2 last:border-0 last:pb-0">
                <span>{{ carb.name }}</span>
                <strong class="text-accent-primary">{{ carb.amount }}</strong>
              </li>
              <li v-if="carbsPlanned.length === 0" class="text-xs text-gray-500 italic">
                No hay alimentos altos en carbohidratos en este plan.
              </li>
            </ul>
          </div>
        </div>

        <!-- Botón de Proteínas -->
        <div class="overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#151515]">
          <button
            class="flex w-full items-center justify-between px-5 py-4 text-left font-bold text-white transition-all hover:bg-[#1F1F1F] active:bg-[#252525]"
            @click="showProteins = !showProteins"
          >
            <span class="flex items-center gap-3">
              <span class="material-symbols-outlined text-accent-primary">egg_alt</span>
              Proteínas
            </span>
            <span
              class="material-symbols-outlined transition-transform duration-300 text-gray-500"
              :class="{ 'rotate-180': showProteins }"
            >
              expand_more
            </span>
          </button>
          <div v-show="showProteins" class="border-t border-[#2A2A2A] bg-[#0E0E0E] p-5 transition-all">
            <ul class="space-y-3">
              <li v-for="(protein, index) in proteinsPlanned" :key="index" class="flex justify-between text-sm text-gray-300 border-b border-[#1F1F1F] pb-2 last:border-0 last:pb-0">
                <span>{{ protein.name }}</span>
                <strong class="text-accent-primary">{{ protein.amount }}</strong>
              </li>
              <li v-if="proteinsPlanned.length === 0" class="text-xs text-gray-500 italic">
                No hay alimentos altos en proteínas en este plan.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje si no hay plan -->
    <div v-else-if="result && !result.dietPlan" class="mt-8 text-center text-gray-500">
      <span class="material-symbols-outlined text-4xl mb-2">no_meals</span>
      <p>Hola, {{ userName }}. No se encontró un plan nutricional Activo.</p>
    </div>
  </div>
</template>
