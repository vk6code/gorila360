<script setup>
import { onMounted, computed, ref } from 'vue'
import { useAuth } from '@/stores/auth'
import { useDietStore } from '@/stores/diet'

const { user } = useAuth()
const dietStore = useDietStore()

// Initialize store
onMounted(() => {
  // 1. Load local data immediately (0ms latency)
  dietStore.loadFromLocal()
  // 2. Sync with server in background
  dietStore.sync()
})

// Computed properties mapped from store
const fatsPlanned = computed(() => dietStore.fatsPlanned)
const carbsPlanned = computed(() => dietStore.carbsPlanned)
const proteinsPlanned = computed(() => dietStore.proteinsPlanned)
const loading = computed(() => dietStore.loading)
const error = computed(() => dietStore.error)
const dietPlan = computed(() => dietStore.dietPlan)

const userName = computed(() => user.value?.name || 'Usuario')

// --- Estado para controlar la visibilidad de las listas ---
const showFats = ref(false)
const showCarbs = ref(false)
const showProteins = ref(false)
</script>

<template>
  <div class="flex flex-col p-6 font-display text-text-primary">
    <h1 class="text-heading-lg font-bold text-accent-primary mb-6">
      Dieta
    </h1>
    <pre class="text-xs text-green-400 bg-black p-4 overflow-auto max-h-40 border border-green-900">
      {{ dietPlan }}
    </pre>

    <!-- Estado de carga (Solo si no hay datos locales y está cargando) -->
    <div v-if="loading && !dietPlan" class="mt-4 text-text-secondary animate-pulse">
      Cargando plan nutricional...
    </div>

    <!-- Estado de error -->
    <div v-if="error && !dietPlan" class="mt-4 rounded-xl bg-red-900/20 border border-red-900/50 p-4 text-red-400">
      <h3 class="font-bold flex items-center gap-2">
        <span class="material-symbols-outlined">error</span>
        Error de Conexión
      </h3>
      <p class="text-sm mt-2 text-red-300/80">No se pudo cargar el plan de dieta.</p>
      <pre class="mt-3 whitespace-pre-wrap rounded bg-black/30 p-3 text-xs text-red-300 font-mono border border-red-900/30">{{ error.message }}</pre>
    </div>

    <!-- Contenido principal cuando los datos están listos (Local o Remoto) -->
    <div v-if="dietPlan" class="mt-2">
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
    <div v-else-if="!loading && !dietPlan" class="mt-8 text-center text-gray-500">
      <span class="material-symbols-outlined text-4xl mb-2">no_meals</span>
      <p>Hola, {{ userName }}. No se encontró un plan nutricional Activo.</p>
    </div>
  </div>
</template>
