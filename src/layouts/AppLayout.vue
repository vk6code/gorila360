<template>
  <div class="relative flex h-screen flex-col overflow-hidden bg-background-primary font-display text-text-primary">
    <!-- Contenido de la página (Dashboard, Plans, etc.) que podrá hacer scroll -->
    <div class="flex-1 overflow-y-auto pb-24">
      <router-view />
    </div>

    <!-- Barra de Navegación Fija Abajo -->
    <nav class="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-background-primary/80 px-4 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-sm">
      <div class="flex justify-between">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          @click="goTo(tab.name)"
          class="relative flex flex-1 flex-col items-center justify-center gap-1 pt-1 pb-2 transition-all duration-200 ease-in-out active:scale-95"
          :class="$route.name === tab.name ? 'text-accent-primary' : 'text-text-secondary'"
        >
          <div
            class="absolute top-0 h-0.5 w-8 rounded-full bg-accent-primary transition-all duration-300"
            :class="$route.name === tab.name ? 'opacity-100' : 'opacity-0'"
          ></div>
          <span class="material-symbols-outlined text-2xl">
            {{ tab.icon }}
          </span>
          <p class="text-xs font-medium leading-normal tracking-[0.015em]">{{ tab.label }}</p>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const tabs = [
  { name: 'dashboard', label: 'Inicio', icon: 'home' },
  { name: 'plans', label: 'Planes', icon: 'fitness_center' },
  { name: 'diet', label: 'Dieta', icon: 'restaurant' },
  { name: 'progress', label: 'Progreso', icon: 'bar_chart' },
];

const goTo = (routeName) => {
  router.push({ name: routeName });
};
</script>