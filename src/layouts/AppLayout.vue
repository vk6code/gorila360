<template>
  <div class="relative flex h-screen flex-col overflow-hidden bg-background-primary font-display text-text-primary">
    <!-- Contenido de la página (Dashboard, Plans, etc.) que podrá hacer scroll -->
    <div class="flex-1 overflow-y-auto pb-24">
      <router-view />
    </div>

    <!-- Barra de Navegación Fija Abajo -->
    <nav class="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-background-primary px-4 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div class="flex justify-between">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          @click="goTo(tab.name)"
          class="flex flex-1 flex-col items-center justify-end gap-1.5 py-1 transition-all duration-200 ease-in-out active:scale-95"
          :class="$route.name === tab.name ? 'text-accent-primary' : 'text-text-secondary'"
        >
          <div class="relative flex flex-col items-center">
            <span class="material-symbols-outlined flex h-7 items-center justify-center text-2xl">
              {{ tab.icon }}
            </span>
            <div
              class="absolute -bottom-1 h-1 w-1 rounded-full bg-accent-primary transition-all duration-300"
              :class="$route.name === tab.name ? 'opacity-100 scale-100' : 'opacity-0 scale-0'"
            ></div>
          </div>
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
  { name: 'dashboard', label: 'Home', icon: 'home' },
  { name: 'plans', label: 'Plans', icon: 'fitness_center' },
  { name: 'diet', label: 'Diet', icon: 'restaurant' },
  { name: 'progress', label: 'Progress', icon: 'bar_chart' },
];

const goTo = (routeName) => {
  router.push({ name: routeName });
};
</script>