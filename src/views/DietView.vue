<script setup>
import { onMounted, computed, ref } from 'vue'
import { useAuth } from '@/stores/auth'
import { useDietStore } from '@/stores/diet'

// Inicializamos con seguridad
const auth = useAuth()
const dietStore = useDietStore()

// LOGS DE DEBUG
console.log('--- DEBUG START ---')
console.log('DietStore:', dietStore)
// Accessing .value because auth.user is a computed ref
console.log('Auth User (raw):', auth.user)
console.log('Auth User (value):', auth.user?.value)
console.log('--- DEBUG END ---')

// Inicialización segura
onMounted(() => {
  if (dietStore && dietStore.loadFromLocal) dietStore.loadFromLocal()
  if (dietStore && dietStore.sync) dietStore.sync()
})

// Mapeo seguro
const fatsPlanned = computed(() => dietStore?.fatsPlanned || [])
const carbsPlanned = computed(() => dietStore?.carbsPlanned || [])
const proteinsPlanned = computed(() => dietStore?.proteinsPlanned || [])
const loading = computed(() => dietStore?.loading || false)
const error = computed(() => dietStore?.error || null)
// Avoid complex object interpolation for now
const dietPlan = computed(() => dietStore?.dietPlan || null)

// Manejo seguro del usuario
// auth.user is a ComputedRef, so we access .value
const user = computed(() => auth.user?.value || null)
const userName = computed(() => user.value?.name || 'Usuario')
const userId = computed(() => user.value?.sub || user.value?.id || "1")

// UI State
const showFats = ref(false)
const showCarbs = ref(false)
const showProteins = ref(false)
</script>

<template>
  <div class="flex flex-col p-6 font-display text-text-primary">
    <h1 class="text-heading-lg font-bold text-accent-primary mb-6">
      Dieta (Debug Mode)
    </h1>

    <!-- Debug Panel (Chivato) -->
    <div class="mb-6 p-4 bg-gray-900 rounded-xl border border-gray-700 text-xs font-mono text-green-400 overflow-x-auto">
      <h3 class="font-bold text-white mb-2 border-b border-gray-700 pb-1">🕵️ Chivato de Datos</h3>
      <div class="grid grid-cols-2 gap-2 mb-2">
        <div><span class="text-gray-400">User ID:</span> {{ userId }}</div>
        <div><span class="text-gray-400">Loading:</span> {{ loading }}</div>
        <div class="col-span-2"><span class="text-gray-400">Error:</span> {{ error?.message || error || 'None' }}</div>
      </div>
      <p class="text-gray-400 mb-1">Diet Plan Status:</p>
      <!-- Avoid printing the full object to prevent _s error if it's the cause -->
      <pre class="bg-black/50 p-2 rounded max-h-40 overflow-auto">{{ dietPlan ? 'Plan Loaded (Object)' : 'No Plan (null)' }}</pre>
    </div>

    <!-- Estado de carga -->
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
    </div>

    <!-- Contenido principal -->
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
