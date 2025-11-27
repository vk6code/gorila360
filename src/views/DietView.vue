<script setup>
import { onMounted, computed, ref } from 'vue'
import { useAuth } from '@/stores/auth'
import { useDietStore } from '@/stores/diet'

// Inicializamos con seguridad
const auth = useAuth()
const dietStore = useDietStore()

// Inicialización segura
onMounted(() => {
  if (dietStore && dietStore.loadFromLocal) dietStore.loadFromLocal()
  if (dietStore && dietStore.sync) dietStore.sync()
})

// Mapeo seguro
const fatsPlanned = computed(() => dietStore?.fatsPlanned || [])
const carbsPlanned = computed(() => dietStore?.carbsPlanned || [])
const proteinsPlanned = computed(() => dietStore?.proteinsPlanned || [])
const fixedFoods = computed(() => dietStore?.fixedFoods || [])
const recipes = computed(() => dietStore?.recipes || [])
const macros = computed(() => dietStore?.macrosDistribution || { fats: 33, carbs: 33, proteins: 33 })

const remainingMacros = computed(() => dietStore?.remainingMacros || { fats: 0, carbs: 0, proteins: 0 })
const dailyTargets = computed(() => dietStore?.dailyTargets || { fats: 0, carbs: 0, proteins: 0 })

const loading = computed(() => dietStore?.loading || false)
const error = computed(() => dietStore?.error || null)
const dietPlan = computed(() => dietStore?.dietPlan || null)

// Manejo seguro del usuario
const user = computed(() => auth.user?.value || null)
const userName = computed(() => user.value?.name || 'Usuario')

// UI State
const mainTab = ref('alimentos') // 'alimentos' | 'recetas'
const activeMacroTab = ref('fats')

const macroTabs = [
  { id: 'fats', label: 'Grasas', icon: 'water_drop' },
  { id: 'carbs', label: 'Carbos', icon: 'grain' },
  { id: 'proteins', label: 'Proteínas', icon: 'egg_alt' },
]

const currentMacroList = computed(() => {
  switch (activeMacroTab.value) {
    case 'fats': return fatsPlanned.value
    case 'carbs': return carbsPlanned.value
    case 'proteins': return proteinsPlanned.value
    default: return []
  }
})

const toggleItem = (item) => {
  // If item is a string (legacy ID), ignore or handle gracefully
  if (typeof item === 'string') return;

  if (dietStore && dietStore.toggleFood) {
    dietStore.toggleFood(item)
  }
}

const isChecked = (item) => {
   // Check if item ID is in the store's checked set
   const id = item.id || `${item.name}-${item.amount}`;
   return dietStore?.checkedFoodIds?.has(id) || false;
}



// Donut Chart Logic (CSS Conic Gradient)
const donutStyle = computed(() => {
  const f = macros.value.fats
  const c = macros.value.carbs
  const p = macros.value.proteins
  // Colors: Fats (Yellow/Gold), Carbs (Orange/Red), Proteins (Blue/Gray) -> Adjusted to Theme
  // Theme: Fats (Gold #C7A64F), Carbs (White/Silver #E0E0E0), Proteins (Dark Gray #5A5A5A)
  // Let's use distinct colors for the chart:
  // Fats: #C7A64F (Gold)
  // Carbs: #FFFFFF (White)
  // Proteins: #333333 (Dark Gray)
  return {
    background: `conic-gradient(
      #C7A64F 0% ${f}%,
      #FFFFFF ${f}% ${f + c}%,
      #333333 ${f + c}% 100%
    )`
  }
})
</script>

<template>
  <div class="min-h-screen bg-background-primary p-6 font-sans text-text-primary pb-24">
    <!-- Header -->
    <header class="mb-6">
      <h1 class="text-heading-lg font-bold text-accent-primary tracking-tight mb-2">DIETA</h1>
      <p class="text-body-md text-text-secondary uppercase tracking-wider">
        PLAN DE <span class="text-white font-semibold">{{ userName }}</span>
      </p>
    </header>

    <!-- Main Tabs (Alimentos / Recetas) -->
    <div class="flex border-b border-[#333] mb-6">
      <button
        @click="mainTab = 'alimentos'"
        class="flex-1 pb-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2"
        :class="mainTab === 'alimentos' ? 'border-accent-primary text-white' : 'border-transparent text-text-secondary hover:text-white'"
      >
        Alimentos
      </button>
      <button
        @click="mainTab = 'recetas'"
        class="flex-1 pb-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2"
        :class="mainTab === 'recetas' ? 'border-accent-primary text-white' : 'border-transparent text-text-secondary hover:text-white'"
      >
        Recetas
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !dietPlan" class="mb-6 text-accent-primary animate-pulse font-bold tracking-wider">
      CARGANDO PLAN...
    </div>

    <!-- Error State -->
    <div v-if="error" class="mb-6 p-4 bg-red-900/20 border border-feedback-negative rounded-[16px] text-feedback-negative">
       <p class="font-bold">Error</p>
       <p class="text-sm opacity-80">{{ error.message || error }}</p>
    </div>

    <!-- CONTENT: ALIMENTOS -->
    <div v-if="mainTab === 'alimentos' && dietPlan">

      <!-- 1. MACROS CHART & PROGRESS -->
      <section class="mb-8 bg-surface p-5 rounded-[16px] border border-[#333]">
        <div class="flex items-center gap-6 mb-6">
          <!-- Donut Chart (Plan Distribution) -->
          <div class="relative w-24 h-24 rounded-full flex items-center justify-center shadow-gold-glow shrink-0" :style="donutStyle">
            <div class="w-16 h-16 bg-surface rounded-full flex items-center justify-center flex-col">
               <span class="text-[10px] text-text-secondary uppercase tracking-widest">Plan</span>
               <span class="text-xs font-bold text-white">DIARIO</span>
            </div>
          </div>

          <!-- Legend / Targets -->
          <div class="flex-1 space-y-2">
             <div class="flex justify-between text-xs uppercase tracking-wide text-text-secondary mb-1">
               <span>Objetivos Diarios</span>
             </div>
             <div class="grid grid-cols-3 gap-2 text-center">
               <div class="bg-[#1a1a1a] rounded p-1 border border-[#333]">
                 <span class="block text-[10px] text-[#C7A64F]">Grasas</span>
                 <span class="block text-xs font-bold text-white">{{ dailyTargets.fats }}g</span>
               </div>
               <div class="bg-[#1a1a1a] rounded p-1 border border-[#333]">
                 <span class="block text-[10px] text-white">Carbos</span>
                 <span class="block text-xs font-bold text-white">{{ dailyTargets.carbs }}g</span>
               </div>
               <div class="bg-[#1a1a1a] rounded p-1 border border-[#333]">
                 <span class="block text-[10px] text-gray-400">Protes</span>
                 <span class="block text-xs font-bold text-white">{{ dailyTargets.proteins }}g</span>
               </div>
             </div>
          </div>
        </div>

        <!-- Remaining Macros Progress Bars -->
        <div class="space-y-4 pt-4 border-t border-[#333]">
          <h4 class="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">Te quedan por consumir:</h4>

          <!-- Fats Bar -->
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span class="text-[#C7A64F] font-bold">Grasas</span>
              <span class="text-white">{{ remainingMacros.fats }}g <span class="text-text-secondary">/ {{ dailyTargets.fats }}g</span></span>
            </div>
            <div class="w-full bg-[#222] rounded-full h-2">
              <div
                class="bg-[#C7A64F] h-2 rounded-full transition-all duration-500"
                :style="{ width: `${Math.min(100, (remainingMacros.fats / dailyTargets.fats) * 100)}%` }"
              ></div>
            </div>
          </div>

          <!-- Carbs Bar -->
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span class="text-white font-bold">Carbos</span>
              <span class="text-white">{{ remainingMacros.carbs }}g <span class="text-text-secondary">/ {{ dailyTargets.carbs }}g</span></span>
            </div>
            <div class="w-full bg-[#222] rounded-full h-2">
              <div
                class="bg-white h-2 rounded-full transition-all duration-500"
                :style="{ width: `${Math.min(100, (remainingMacros.carbs / dailyTargets.carbs) * 100)}%` }"
              ></div>
            </div>
          </div>

          <!-- Proteins Bar -->
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span class="text-gray-400 font-bold">Proteínas</span>
              <span class="text-white">{{ remainingMacros.proteins }}g <span class="text-text-secondary">/ {{ dailyTargets.proteins }}g</span></span>
            </div>
            <div class="w-full bg-[#222] rounded-full h-2">
              <div
                class="bg-[#5A5A5A] h-2 rounded-full transition-all duration-500"
                :style="{ width: `${Math.min(100, (remainingMacros.proteins / dailyTargets.proteins) * 100)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. ALIMENTOS FIJOS -->
      <section class="mb-8">
        <h3 class="text-sm font-bold text-accent-primary uppercase tracking-wider mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined">lock</span>
          Alimentos Fijos
        </h3>
        <div class="space-y-3">
          <div
            v-for="(item, index) in fixedFoods"
            :key="`fixed-${index}`"
            @click="toggleItem(item)"
            class="flex items-center justify-between p-4 rounded-[16px] border border-[#333] bg-surface transition-all duration-300 cursor-pointer select-none"
            :class="isChecked(item) ? 'opacity-50 border-transparent' : 'hover:border-accent-primary/30'"
          >
             <div class="flex items-center gap-4">
              <div
                class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300"
                :class="isChecked(item) ? 'border-accent-primary bg-accent-primary' : 'border-[#333]'"
              >
                <span v-if="isChecked(item)" class="material-symbols-outlined text-black text-sm font-bold">check</span>
              </div>
              <span class="font-medium text-white">{{ item.name }}</span>
             </div>
             <span class="font-bold text-accent-primary">{{ item.amount }}</span>
          </div>
          <div v-if="fixedFoods.length === 0" class="text-center py-4 text-text-secondary text-sm italic">
            No hay alimentos fijos hoy.
          </div>
        </div>
      </section>

      <!-- 3. INTERCAMBIABLES (MACROS) -->
      <section>
        <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined">swap_horiz</span>
          Intercambiables
        </h3>

        <!-- Macro Tabs -->
        <div class="flex p-1 mb-4 bg-black/40 rounded-[12px] border border-[#333]">
          <button
            v-for="tab in macroTabs"
            :key="tab.id"
            @click="activeMacroTab = tab.id"
            class="flex-1 py-2 px-2 rounded-[10px] text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1"
            :class="activeMacroTab === tab.id ? 'bg-accent-primary text-black shadow-gold-glow' : 'text-text-secondary hover:text-white'"
          >
            <span class="material-symbols-outlined text-[16px]">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
          </button>
        </div>

        <!-- List -->
        <div class="space-y-3">
          <div
            v-for="(item, index) in currentMacroList"
            :key="`${activeMacroTab}-${index}`"
            @click="toggleItem(item)"
            class="group flex items-center justify-between p-4 rounded-[16px] border border-[#333] bg-surface transition-all duration-300 cursor-pointer select-none"
            :class="isChecked(item) ? 'opacity-50 border-transparent' : 'hover:border-accent-primary/30'"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300"
                :class="isChecked(item) ? 'border-accent-primary bg-accent-primary' : 'border-[#333] group-hover:border-accent-primary'"
              >
                <span v-if="isChecked(item)" class="material-symbols-outlined text-black text-sm font-bold">check</span>
              </div>
              <span class="font-medium text-white">{{ item.name }}</span>
            </div>
            <span class="font-bold text-accent-primary">{{ item.amount }}</span>
          </div>

          <div v-if="currentMacroList.length === 0" class="text-center py-8 text-text-secondary border border-[#333] border-dashed rounded-[16px]">
            <span class="material-symbols-outlined text-3xl mb-2 opacity-50">no_food</span>
            <p class="uppercase tracking-wider text-xs">Sin opciones</p>
          </div>
        </div>
      </section>
    </div>

    <!-- CONTENT: RECETAS -->
    <div v-if="mainTab === 'recetas'" class="space-y-4">
      <div v-if="recipes.length > 0">
        <div
          v-for="recipe in recipes"
          :key="recipe.id"
          class="p-5 rounded-[16px] border border-[#333] bg-surface hover:bg-[#1a1a1a] transition-colors cursor-pointer flex items-center justify-between group"
        >
          <span class="font-medium text-white group-hover:text-accent-primary transition-colors">{{ recipe.name }}</span>
          <span class="material-symbols-outlined text-text-secondary group-hover:text-accent-primary">chevron_right</span>
        </div>
      </div>
      <div v-else class="text-center py-20 text-text-secondary">
        <span class="material-symbols-outlined text-6xl mb-4 text-[#333]">menu_book</span>
        <p class="text-xl font-bold text-white mb-2">Sin Recetas</p>
        <p class="text-sm">Aún no tienes recetas asignadas.</p>
      </div>
    </div>

    <!-- Empty State Global -->
    <div v-if="!loading && !dietPlan && mainTab === 'alimentos'" class="text-center py-20 text-text-secondary">
      <span class="material-symbols-outlined text-6xl mb-4 text-[#333]">no_meals</span>
      <p class="text-xl font-bold text-white mb-2">Sin Plan Activo</p>
    </div>
  </div>
</template>
