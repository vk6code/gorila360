<script setup>
import { ref, computed } from 'vue';
import { useAuth } from '@/stores/auth';

const { logout } = useAuth();

const handleLogout = () => {
  logout();
  window.location.href = 'https://gorila360.es';
};

// Usar datos reales del usuario autenticado
const { user: authUser } = useAuth();
const user = computed(() => ({
  name: authUser.value?.name || 'Gorila'
}));

const dailyWorkout = ref({
  title: 'Entreno de Pierna',
  image: '/assets/leg-day-bg.jpg', // Placeholder
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
  <div class="min-h-screen bg-background-primary text-text-primary font-sans pb-24">

    <!-- Header -->
    <header class="p-6 flex justify-between items-center">
      <button @click="handleLogout" class="text-text-secondary hover:text-white transition-colors">
        <span class="material-symbols-outlined">logout</span>
      </button>
      <div class="text-center">
        <h1 class="text-heading-md font-bold tracking-tighter text-accent-primary uppercase">
          Gorilas<span class="text-white">360°</span>
        </h1>
        <p class="text-caption text-text-secondary uppercase tracking-wider">¡Hola, {{ user.name }}!</p>
      </div>
      <div class="w-6"></div> <!-- Spacer for centering -->
    </header>

    <!-- Hero Section: Daily Workout -->
    <section class="px-4 mb-8">
      <div class="relative overflow-hidden rounded-[16px] bg-surface border border-[#333] shadow-lg p-6 text-center h-64 flex flex-col justify-center items-center group">
        <!-- Background Image/Gradient -->
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-0">
          <img v-if="dailyWorkout.image" :src="dailyWorkout.image" class="w-full h-full object-cover opacity-30 mix-blend-overlay" alt="Workout bg" />
        </div>

        <div class="relative z-10 flex flex-col items-center">
          <div class="mb-4">
            <span class="text-4xl mb-2 block">💪</span>
            <h2 class="text-heading-lg font-bold leading-none text-white">
              HOY TOCA <br/>
              <span class="text-accent-primary">
                {{ dailyWorkout.title }}
              </span>
            </h2>
          </div>

          <button
            @click="startWorkout"
            class="mt-2 flex flex-col items-center transition-transform transform group-hover:scale-105 active:scale-95"
          >
            <div class="w-16 h-16 rounded-full bg-accent-primary text-black flex items-center justify-center shadow-gold-glow mb-3 animate-pulse-slow">
              <span class="material-symbols-outlined text-4xl">play_arrow</span>
            </div>
            <span class="text-xs font-bold tracking-widest uppercase text-accent-primary">
              Iniciar
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="px-4 space-y-4">
      <div class="bg-surface rounded-[16px] p-6 border border-[#333]">
        <h3 class="text-sm font-bold text-text-secondary uppercase tracking-wider mb-6 flex items-center gap-2">
          <span class="material-symbols-outlined text-accent-primary">fitness_center</span>
          Mi Misión Gorila
        </h3>

        <!-- Streak -->
        <div class="mb-6">
          <div class="flex justify-between text-xs mb-2 uppercase tracking-wide">
            <span class="text-text-secondary">Racha Semanal</span>
            <span class="text-white font-bold">{{ stats.streak }}/{{ stats.streakTarget }}</span>
          </div>
          <div class="w-full bg-[#222] rounded-full h-2">
            <div class="bg-accent-primary h-2 rounded-full shadow-gold-glow" style="width: 75%"></div>
          </div>
        </div>

        <!-- Visual Goal -->
        <div class="mb-6">
          <div class="flex justify-between text-xs mb-2 uppercase tracking-wide">
            <span class="text-text-secondary">Hito Visual (8 semanas)</span>
            <span class="text-accent-primary font-bold">15%</span>
          </div>
          <div class="w-full bg-[#222] rounded-full h-2">
            <div class="bg-accent-primary/80 h-2 rounded-full" style="width: 15%"></div>
          </div>
        </div>

        <!-- Mission -->
        <div>
          <div class="flex justify-between text-xs mb-2 uppercase tracking-wide">
            <span class="text-text-secondary">Objetivo: {{ user.mission || 'Padre Imparable' }}</span>
            <span class="text-white font-bold">4%</span>
          </div>
          <div class="w-full bg-[#222] rounded-full h-2">
            <div class="bg-accent-primary/60 h-2 rounded-full" style="width: 4%"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Rewards Section -->
    <section class="px-4 mt-4">
      <div class="bg-surface rounded-[16px] p-6 border border-[#333]">
        <h3 class="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined text-accent-primary">emoji_events</span>
          Tus Premios
        </h3>
        <div class="flex items-center gap-4">
          <div class="bg-[#222] p-3 rounded-full border border-[#333] text-2xl">
             👕
          </div>
          <div class="flex-1">
             <div class="flex justify-between items-center mb-2">
               <p class="text-sm font-bold text-white">Camiseta del Equipo</p>
               <span class="text-xs text-text-secondary">6 meses</span>
             </div>
             <div class="w-full bg-[#222] rounded-full h-1.5">
                <div class="bg-accent-primary h-1.5 rounded-full" style="width: 30%"></div>
             </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
