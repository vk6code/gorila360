<script setup>
import { ref } from 'vue';
import { useAuth } from '@/stores/auth';
import {
  ChevronLeftIcon,
  PlayIcon
} from '@heroicons/vue/24/solid';

const { logout } = useAuth();

const handleLogout = () => {
  logout();
  window.location.href = 'https://gorila360.es';
};

// Mocking the GraphQL data for the MVP build
const user = ref({ name: 'Alejandro' });
const dailyWorkout = ref({
  title: 'Entreno de Pierna',
  image: '/assets/leg-day-bg.jpg', // Use a dark, gritty gym texture
});
const stats = ref({
  streak: 3,
  streakTarget: 4,
  visual: 75,
  mission: 4, // "4%"
  tshirt: 6, // months
  pack: 2    // renewals
});

const startWorkout = () => {
  console.log("🚀 Launching Video Player Modal...");
  // Trigger overlay video player here
};
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white font-sans pb-24">

    <header class="p-6 flex justify-between items-center">
      <button @click="handleLogout" class="text-gray-400 hover:text-white transition-colors">
        <ChevronLeftIcon class="w-6 h-6" />
      </button>
      <div class="text-center">
        <h1 class="text-xl font-bold tracking-tighter text-orange-500 uppercase">
          Gorilas<span class="text-white">360°</span>
        </h1>
        <p class="text-xs text-gray-400">¡Hola, {{ user.name }}.</p>
      </div>
      <div class="w-6"></div> </header>

    <section class="px-4 mb-6">
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-900/80 to-gray-800 border border-orange-500/20 shadow-lg shadow-orange-900/20 p-6 text-center h-64 flex flex-col justify-center items-center group">
        <div class="absolute inset-0 bg-black/40 z-0">
          <img v-if="dailyWorkout.image" :src="dailyWorkout.image" class="w-full h-full object-cover opacity-50 mix-blend-overlay" alt="Workout bg" />
        </div>

        <div class="relative z-10">
          <div class="flex items-center justify-center space-x-2 mb-4">
            <span class="text-2xl">💪</span>
            <h2 class="text-2xl font-extrabold leading-tight">
              ¡Hoy toca <br/>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-200">
                {{ dailyWorkout.title }}
              </span>
            </h2>
          </div>

          <button
            @click="startWorkout"
            class="mt-4 flex flex-col items-center transition-transform transform group-hover:scale-105 active:scale-95"
          >
            <div class="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-orange-500/50 shadow-lg mb-2 animate-pulse-slow">
              <PlayIcon class="w-8 h-8 text-white ml-1" />
            </div>
            <span class="text-xs font-semibold tracking-wider uppercase text-orange-100">
              Iniciar Entrenamiento
            </span>
          </button>
        </div>
      </div>
    </section>

    <section class="px-4 space-y-4">
      <div class="bg-gray-800/50 backdrop-blur-md rounded-xl p-5 border border-gray-700">
        <h3 class="text-sm font-bold text-gray-300 mb-4 flex items-center">
          🦍 Mi Misión Gorila
        </h3>

        <div class="mb-4">
          <div class="flex justify-between text-xs mb-1">
            <span class="text-gray-400">🔥 Racha: {{ stats.streak }}/{{ stats.streakTarget }} entrenos</span>
            <span class="text-orange-400 font-bold">75%</span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-2.5">
            <div class="bg-gradient-to-r from-orange-600 to-orange-400 h-2.5 rounded-full" style="width: 75%"></div>
          </div>
        </div>

        <div class="mb-4">
          <div class="flex justify-between text-xs mb-1">
            <span class="text-gray-400">🚀 Hito Visual: 8 semanas restantes</span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-2.5">
            <div class="bg-orange-500 h-2.5 rounded-full" style="width: 15%"></div>
          </div>
        </div>

        <div>
          <div class="flex justify-between text-xs mb-1">
            <span class="text-gray-400">🎯 {{ user.mission || 'Padre imparable' }}</span>
            <span class="text-gray-500">4%</span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-2.5">
            <div class="bg-orange-500 h-2.5 rounded-full" style="width: 4%"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="px-4 mt-4">
      <div class="bg-gray-800/50 backdrop-blur-md rounded-xl p-5 border border-gray-700">
        <h3 class="text-sm font-bold text-yellow-500 mb-4 flex items-center">
          🏆 Tus Premios
        </h3>
        <div class="flex items-center space-x-4">
          <div class="bg-orange-900/50 p-3 rounded-full border border-orange-500/30">
             👕
          </div>
          <div class="flex-1">
             <p class="text-xs text-gray-300">Camiseta del Equipo: <span class="text-gray-500">6 meses</span></p>
             <div class="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                <div class="bg-yellow-500 h-1.5 rounded-full" style="width: 30%"></div>
             </div>
          </div>
        </div>
      </div>
    </section>

    <nav class="fixed bottom-0 w-full bg-gray-900 border-t border-gray-800 pb-6 pt-3 px-6 flex justify-between items-center z-50 hidden">
      <!-- Duplicate nav removed/hidden to avoid conflict with AppLayout -->
    </nav>
  </div>
</template>

<style scoped>
/* Add custom scrollbar hiding or specific transition utilities here */
.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
