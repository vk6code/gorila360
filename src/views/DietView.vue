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
    <h1 class="text-heading-lg font-bold">
      Diet
    </h1>

    <!-- Estado de carga -->
    <div v-if="loading" class="mt-4 text-text-secondary">
      Cargando datos de la dieta desde el backend...
    </div>

    <!-- Estado de error -->
    <div v-if="error" class="mt-4 rounded-md bg-red-100 p-4 text-red-800">
      <h3 class="font-bold">
        Error de Conexión
      </h3>
      <p>No se pudo conectar con el backend en <strong>/graphql</strong>.</p>
      <p class="mt-2 text-sm">
        Asegúrate de que tu servidor de FastAPI esté corriendo y que la query <code>GetUserDietPlan</code> exista en tu esquema de GraphQL.
      </p>
      <pre class="mt-2 whitespace-pre-wrap rounded bg-red-200 p-2 text-sm">{{ error.message }}</pre>
    </div>

    <!-- Contenido principal cuando los datos están listos -->
    <div v-if="result && result.userDietPlan" class="mt-4">
      <h2 class="text-heading-md font-semibold">
        Plan para: {{ result.userDietPlan.userName }}
      </h2>

      <div class="mt-6 space-y-4">
        <!-- Botón de Grasas -->
        <div>
          <button
            class="w-full rounded-lg bg-gray-200 px-4 py-3 text-left font-bold text-text-primary transition hover:bg-gray-300"
            @click="showFats = !showFats"
          >
            Grasas Pautadas
          </button>
          <div v-if="showFats" class="mt-2 rounded-lg border border-gray-200 bg-white p-4">
            <ul class="list-disc space-y-2 pl-5">
              <li v-for="fat in result.userDietPlan.fatsPlanned" :key="fat.name">
                {{ fat.name }}: <strong>{{ fat.amount }}</strong>
              </li>
            </ul>
          </div>
        </div>

        <!-- Botón de Carbohidratos -->
        <div>
          <button
            class="w-full rounded-lg bg-gray-200 px-4 py-3 text-left font-bold text-text-primary transition hover:bg-gray-300"
            @click="showCarbs = !showCarbs"
          >
            Carbohidratos Pautados
          </button>
          <div v-if="showCarbs" class="mt-2 rounded-lg border border-gray-200 bg-white p-4">
            <ul class="list-disc space-y-2 pl-5">
              <li v-for="carb in result.userDietPlan.carbsPlanned" :key="carb.name">
                {{ carb.name }}: <strong>{{ carb.amount }}</strong>
              </li>
            </ul>
          </div>
        </div>

        <!-- Botón de Proteínas -->
        <div>
          <button
            class="w-full rounded-lg bg-gray-200 px-4 py-3 text-left font-bold text-text-primary transition hover:bg-gray-300"
            @click="showProteins = !showProteins"
          >
            Proteínas Pautadas
          </button>
          <div v-if="showProteins" class="mt-2 rounded-lg border border-gray-200 bg-white p-4">
            <ul class="list-disc space-y-2 pl-5">
              <li v-for="protein in result.userDietPlan.proteinsPlanned" :key="protein.name">
                {{ protein.name }}: <strong>{{ protein.amount }}</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
