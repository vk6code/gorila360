<template>
  <div class="flex flex-col min-h-screen bg-[#0E0E0E] pb-20">
    <!-- Top Bar -->
    <div class="px-4 pt-6 pb-4">
      <div class="flex items-center justify-between mb-4">
        <button @click="$router.push({ name: 'student-calendar' })" class="w-9 h-9 rounded-full bg-[#141414] border border-[#333333] flex items-center justify-center">
          <ArrowLeft class="w-4 h-4 text-[#FFFFFF]" />
        </button>
        <div class="flex-1 text-center">
          <div class="text-sm font-medium text-[#FFFFFF] mb-1 capitalize">{{ formattedDate }}</div>
          <div class="inline-flex items-center gap-2 bg-[#3B82F6] rounded-full px-3 py-1">
            <span class="text-xs font-bold text-[#FFFFFF] uppercase tracking-wide">{{ dayData.dayType }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button @click="navigate(-1)" class="w-9 h-9 rounded-full bg-[#141414] border border-[#333333] flex items-center justify-center">
            <ChevronLeft class="w-4 h-4 text-[#FFFFFF]" />
          </button>
          <button @click="navigate(1)" class="w-9 h-9 rounded-full bg-[#141414] border border-[#333333] flex items-center justify-center">
            <ChevronRight class="w-4 h-4 text-[#FFFFFF]" />
          </button>
          <button class="w-9 h-9 rounded-full bg-[#141414] border border-[#333333] flex items-center justify-center">
            <CalendarDays class="w-4 h-4 text-[#C7A64F]" />
          </button>
        </div>
      </div>
      <div class="flex justify-end">
        <button @click="$router.push({ name: 'calendar-edit' })" class="flex items-center gap-2 text-[#C7A64F] text-xs">
          <Edit2 class="w-3.5 h-3.5" />
          <span>Editar plan</span>
        </button>
      </div>
    </div>
    <!-- Main Content Card -->
    <div class="flex-1 px-4 pb-4">
      <div class="bg-[#141414] border border-[#333333] rounded-3xl p-6 space-y-6">
        <!-- Key Metrics -->
        <div class="flex items-center justify-center gap-8">
          <div class="flex flex-col items-center">
            <div class="relative w-24 h-24 mb-3">
              <svg class="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#333333"
                  stroke-width="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#C7A64F"
                  stroke-width="8"
                  fill="none"
                  stroke-dasharray="251.2"
                  stroke-dashoffset="62.8"
                  stroke-linecap="round"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <Flame class="w-6 h-6 text-[#C7A64F] mb-1" />
              </div>
            </div>
            <div class="text-2xl font-bold text-[#C7A64F]">{{ dayData.calories }}</div>
            <div class="text-xs text-[#5A5A5A] uppercase tracking-widest">kcal</div>
          </div>
          <div class="flex flex-col items-center">
            <div class="relative w-24 h-24 mb-3">
              <svg class="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#333333"
                  stroke-width="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#C7A64F"
                  stroke-width="8"
                  fill="none"
                  stroke-dasharray="251.2"
                  stroke-dashoffset="125.6"
                  stroke-linecap="round"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <Footprints class="w-6 h-6 text-[#C7A64F] mb-1" />
              </div>
            </div>
            <div class="text-2xl font-bold text-[#C7A64F]">{{ dayData.steps }}</div>
            <div class="text-xs text-[#5A5A5A] uppercase tracking-widest">pasos</div>
          </div>
        </div>
        <!-- Divider -->
        <div class="border-t border-[#333333]"></div>
        <!-- Workout Section -->
        <div>
          <h3 class="text-xs uppercase tracking-widest text-[#5A5A5A] mb-3">ENTRENAMIENTO</h3>
          <div class="bg-[#0E0E0E] rounded-2xl p-4 mb-4">
            <div class="text-lg font-semibold text-[#FFFFFF] mb-1">{{ dayData.workoutName }}</div>
            <div class="text-sm text-[#5A5A5A]">{{ dayData.focus }}</div>
          </div>
          <button class="w-full bg-[#C7A64F] hover:bg-[#B89542] text-[#000000] rounded-2xl py-4 font-semibold shadow-[0_0_20px_rgba(199,166,79,0.4)] transition-all flex items-center justify-center gap-2">
            <Play class="w-5 h-5" fill="currentColor" />
            Iniciar entrenamiento
          </button>
        </div>
        <!-- Divider -->
        <div class="border-t border-[#333333]"></div>
        <!-- Diet Section -->
        <div>
          <h3 class="text-xs uppercase tracking-widest text-[#5A5A5A] mb-3">DIETA</h3>
          <button class="w-full bg-[#0E0E0E] border border-[#333333] hover:border-[#C7A64F] rounded-2xl p-4 flex items-center justify-center gap-2 transition-all">
            <Utensils class="w-5 h-5 text-[#C7A64F]" />
            <span class="text-sm text-[#FFFFFF]">Abre tu dieta para hoy</span>
          </button>
        </div>
        <!-- Notes -->
        <div class="text-center text-xs text-[#5A5A5A] pt-4">
          <span>Sensación: Buena • Recuperación: Alta</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Edit2,
  Flame,
  Footprints,
  Play,
  Utensils,
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

const currentDate = computed(() => {
  return route.params.date ? new Date(route.params.date) : new Date();
});

const formattedDate = computed(() => {
  return currentDate.value.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});

const auth = useAuth();
const user = computed(() => auth.user || { name: 'Victor' }); // Fallback to Victor for demo

const dayData = computed(() => {
  const name = user.value.name?.toLowerCase() || 'victor';
  const isEven = currentDate.value.getDate() % 2 === 0;

  if (name.includes('alex')) {
    // Datos para Alex (Definición/Rendimiento)
    return {
      dayType: isEven ? 'DÍA B' : 'DÍA A',
      calories: isEven ? '2200' : '2500',
      steps: isEven ? '15,000' : '12,000',
      workoutName: isEven ? 'Endurance - Run & Core' : 'Metcon 1 - Full Body',
      focus: isEven ? 'Cardio y Abdominales' : 'Cuerpo Completo'
    };
  } else {
    // Datos para Victor (Hipertrofia - Default)
    return {
      dayType: isEven ? 'DÍA B' : 'DÍA A',
      calories: isEven ? '3200' : '3000',
      steps: isEven ? '10,000' : '8,000',
      workoutName: isEven ? 'RKO 12 – Día B' : 'RKO 11 – Día A',
      focus: isEven ? 'Enfoque Piernas' : 'Enfoque Pecho y Espalda'
    };
  }
});

const navigate = (days) => {
  const newDate = new Date(currentDate.value);
  newDate.setDate(newDate.getDate() + days);
  const dateString = newDate.toISOString().split('T')[0];
  router.push({ name: 'calendar-day', params: { date: dateString } });
};
</script>
