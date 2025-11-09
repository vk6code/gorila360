<template>
  <div class="relative flex min-h-screen flex-col bg-background-primary text-text-primary font-display">
    <!-- TODO: This banner should be dynamic -->
    <!-- Daily Banner -->
    <div class="bg-accent-primary px-4 py-2 text-center text-sm font-semibold text-black">
      <p>Today is chest day 💪</p>
    </div>

    <!-- Header -->
    <div class="flex items-start justify-between p-6 pb-4">
      <h1 class="text-3xl font-bold leading-tight text-text-primary">
        Welcome, {{ athleteName }}
      </h1>
      <button
        class="flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-[#EAEAEA]"
        @click="goToSettings"
      >
        <span class="material-symbols-outlined text-2xl">settings</span>
      </button>
    </div>

    <!-- Action Cards -->
    <div class="grid grid-cols-1 gap-4 p-6 pt-2">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="flex flex-col gap-3 rounded-xl bg-[#1A1A1A] p-5 shadow-lg cursor-pointer"
        @click="handleCardClick(card.action)"
      >
        <span class="material-symbols-outlined text-3xl text-text-primary">
          {{ card.icon }}
        </span>
        <h2 class="text-lg font-bold leading-tight text-text-primary">
          {{ card.title }}
        </h2>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="sticky bottom-0 left-0 right-0 border-t border-[#35332c] bg-[#1A1A1A] px-4 pb-3 pt-2 flex justify-between">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        @click="goTo(tab.name)"
        class="flex flex-1 flex-col items-center justify-end gap-1 transition-colors"
        :class="$route.path.startsWith('/' + tab.name) ? 'text-accent-primary' : 'text-text-secondary'"
      >
        <span class="material-symbols-outlined flex h-8 items-center justify-center">
          {{ tab.icon }}
        </span>
        <p class="text-xs font-medium leading-normal tracking-[0.015em]">{{ tab.label }}</p>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Example data
const athleteName = ref('Athlete')

// Dashboard action cards
const cards = [
  { title: 'Check your subscription', icon: 'credit_card', action: 'subscription' },
  { title: 'Contact your coach', icon: 'chat', action: 'contact' },
  { title: 'View upcoming workouts', icon: 'calendar_month', action: 'workouts' },
]

// Navigation tabs
const tabs = [
  { name: 'dashboard', label: 'Home', icon: 'home' },
  { name: 'plans', label: 'Plans', icon: 'fitness_center' },
  { name: 'diet', label: 'Diet', icon: 'restaurant' },
  { name: 'progress', label: 'Progress', icon: 'bar_chart' },
]

const goToSettings = () => {
  // Navigate or open settings modal
  console.log('Settings clicked')
}

const handleCardClick = (action) => {
  console.log('Card clicked:', action)
}

const goTo = (routeName) => {
  router.push(`/${routeName}`);
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

.font-display {
  font-family: 'Inter', sans-serif;
}
</style>
