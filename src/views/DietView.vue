<script setup>
import { ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

// --- 1. Define la consulta GraphQL ---
// Esta es una consulta de EJEMPLO. Debes asegurarte de que tu esquema de GraphQL
// en el backend de FastAPI pueda resolver esto.
const GET_DIET_PLAN = gql`
  query GetUserDietPlan {
    # Asumimos que tienes una query "userDietPlan" que devuelve el plan del usuario
    userDietPlan {
      userName
      fatsPlanned {
        name
        amount
      }
      carbsPlanned {
        name
        amount
      }
      proteinsPlanned {
        name
        amount
      }
    }
  }
`

// --- 2. Ejecuta la consulta ---
const { result, loading, error } = useQuery(GET_DIET_PLAN)

// --- 3. Estado para controlar la visibilidad de las listas ---
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
      Cargando datos de la dieta...
    </div>

    <!-- Estado de error -->
    <div v-if="error" class="mt-4 rounded-xl bg-red-900/20 border border-red-900/50 p-4 text-red-400">
      <h3 class="font-bold flex items-center gap-2">
        <span class="material-symbols-outlined">error</span>
        Error de Conexión
      </h3>
      <p class="text-sm mt-2 text-red-300/80">No se pudo conectar con el backend.</p>
      <pre class="mt-3 whitespace-pre-wrap rounded bg-black/30 p-3 text-xs text-red-300 font-mono border border-red-900/30">{{ error.message }}</pre>
    </div>

    <!-- Contenido principal cuando los datos están listos -->
    <div v-if="result && result.userDietPlan" class="mt-2">
      <h2 class="text-heading-md font-semibold text-white mb-6">
        Plan de <span class="text-accent-primary">{{ result.userDietPlan.userName }}</span>
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
              <li v-for="fat in result.userDietPlan.fatsPlanned" :key="fat.name" class="flex justify-between text-sm text-gray-300 border-b border-[#1F1F1F] pb-2 last:border-0 last:pb-0">
                <span>{{ fat.name }}</span>
                <strong class="text-accent-primary">{{ fat.amount }}</strong>
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
              <li v-for="carb in result.userDietPlan.carbsPlanned" :key="carb.name" class="flex justify-between text-sm text-gray-300 border-b border-[#1F1F1F] pb-2 last:border-0 last:pb-0">
                <span>{{ carb.name }}</span>
                <strong class="text-accent-primary">{{ carb.amount }}</strong>
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
              <li v-for="protein in result.userDietPlan.proteinsPlanned" :key="protein.name" class="flex justify-between text-sm text-gray-300 border-b border-[#1F1F1F] pb-2 last:border-0 last:pb-0">
                <span>{{ protein.name }}</span>
                <strong class="text-accent-primary">{{ protein.amount }}</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
