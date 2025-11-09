<template>
  <div class="flex flex-col min-h-screen bg-background-primary p-6 font-display text-text-primary">
    <!-- Header con botón para volver -->
    <div class="flex items-center mb-6">
      <button @click="goBack" class="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
        <span class="material-symbols-outlined">
          arrow_back
        </span>
      </button>
      <h1 class="text-heading-lg font-bold ml-2">
        Rendimiento Semanal
      </h1>
    </div>

    <!-- Rejilla tipo calendario -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
      <div v-for="day in lastWeek" :key="day.name" class="bg-[#1A1A1A] p-4 rounded-xl min-h-[100px]">
        <h3 class="font-bold text-text-secondary">{{ day.name }}</h3>
        <div class="mt-2 text-sm">
          <p v-if="day.activity" class="text-accent-primary">{{ day.activity }}</p>
          <p v-else class="text-text-secondary/50">Descanso</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};

// Datos de ejemplo para el rendimiento de la semana pasada
const lastWeek = [
  { name: 'Lunes', activity: 'Día A: Empuje' },
  { name: 'Martes', activity: null },
  { name: 'Miércoles', activity: 'Día B: Tirón' },
  { name: 'Jueves', activity: null },
  { name: 'Viernes', activity: 'Día C: Pierna' },
  { name: 'Sábado', activity: 'Día D: Cuerpo Completo' },
  { name: 'Domingo', activity: null },
];
</script>