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
const loading = computed(() => dietStore?.loading || false)
const error = computed(() => dietStore?.error || null)
const dietPlan = computed(() => dietStore?.dietPlan || null)

// Manejo seguro del usuario
const user = computed(() => auth.user?.value || null)
const userName = computed(() => user.value?.name || 'Usuario')

// UI State
const activeTab = ref('fats')
const checkedItems = ref(new Set())

const tabs = [
  { id: 'fats', label: 'Grasas', icon: 'water_drop' },
  { id: 'carbs', label: 'Carbos', icon: 'grain' },
  { id: 'proteins', label: 'Proteínas', icon: 'egg_alt' },
]

const currentList = computed(() => {
  switch (activeTab.value) {
    case 'fats': return fatsPlanned.value
    case 'carbs': return carbsPlanned.value
    case 'proteins': return proteinsPlanned.value
    default: return []
  }
})

const toggleItem = (key) => {
  if (checkedItems.value.has(key)) {
    checkedItems.value.delete(key)
  } else {
    checkedItems.value.add(key)
  }
}

const isChecked = (index) => checkedItems.value.has(`${activeTab.value}-${index}`)
</script>

<template>
  <div class="min-h-screen bg-background-primary p-6 font-sans text-text-primary">
    <!-- Header -->
    <header class="mb-8">
      <h1 class="text-heading-lg font-bold text-accent-primary tracking-tight mb-2">DIETA</h1>
      <p class="text-body-md text-text-secondary uppercase tracking-wider">
        PLAN DE <span class="text-white font-semibold">{{ userName }}</span>
      </p>
    </header>

    <!-- Debug Panel (Collapsed by default or small) -->
    <div v-if="error" class="mb-6 p-4 bg-red-900/20 border border-feedback-negative rounded-[16px] text-feedback-negative">
       <p class="font-bold">Error de sincronización</p>
       <p class="text-sm opacity-80">{{ error.message || error }}</p>
    </div>

    <div v-if="loading && !dietPlan" class="mb-6 text-accent-primary animate-pulse font-bold tracking-wider">
      CARGANDO PLAN...
    </div>

    <div v-if="dietPlan">
      <!-- Tabs (Segmented Control) -->
      <div class="flex p-1 mb-8 bg-black/40 rounded-[12px] border border-[#333]">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-1 py-3 px-2 rounded-[10px] text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
          :class="activeTab === tab.id ? 'bg-accent-primary text-black shadow-gold-glow' : 'text-text-secondary hover:text-white'"
        >
          <span class="material-symbols-outlined text-[18px]">{{ tab.icon }}</span>
          <span class="hidden sm:inline">{{ tab.label }}</span>
        </button>
      </div>

      <!-- Content List -->
      <div class="space-y-3">
        <div
          v-for="(item, index) in currentList"
          :key="index"
          @click="toggleItem(`${activeTab}-${index}`)"
          class="group flex items-center justify-between p-4 rounded-[16px] border border-[#333] bg-surface transition-all duration-300 cursor-pointer select-none"
          :class="isChecked(index) ? 'opacity-50 border-transparent' : 'hover:border-accent-primary/30'"
        >
          <div class="flex items-center gap-4">
            <!-- Custom Checkbox -->
            <div
              class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300"
              :class="isChecked(index) ? 'border-accent-primary bg-accent-primary' : 'border-[#333] group-hover:border-accent-primary'"
            >
              <span v-if="isChecked(index)" class="material-symbols-outlined text-black text-sm font-bold">check</span>
            </div>

            <span
              class="font-medium transition-colors duration-300"
              :class="isChecked(index) ? 'text-text-secondary' : 'text-white'"
            >
              {{ item.name }}
            </span>
          </div>

          <span
            class="font-bold tracking-wide transition-colors duration-300"
            :class="isChecked(index) ? 'text-text-secondary' : 'text-accent-primary'"
          >
            {{ item.amount }}
          </span>
        </div>

        <!-- Empty State -->
        <div v-if="currentList.length === 0" class="text-center py-12 text-text-secondary border border-[#333] border-dashed rounded-[16px]">
          <span class="material-symbols-outlined text-4xl mb-2 opacity-50">no_food</span>
          <p class="uppercase tracking-wider text-sm">Sin alimentos asignados</p>
        </div>
      </div>
    </div>

    <!-- No Plan State -->
    <div v-else-if="!loading" class="text-center py-20 text-text-secondary">
      <span class="material-symbols-outlined text-6xl mb-4 text-[#333]">no_meals</span>
      <p class="text-xl font-bold text-white mb-2">Sin Plan Activo</p>
      <p class="text-sm">No se ha encontrado un plan nutricional para tu usuario.</p>
    </div>
  </div>
</template>
