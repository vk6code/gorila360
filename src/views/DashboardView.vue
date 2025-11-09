<template>
  <div class="gorila-dashboard">
    <!-- TODO: This banner should be dynamic -->
    <!-- Daily Banner -->
    <div class="flex items-start gap-4 rounded-xl border border-[#C7A46F] bg-[#C7A46F]/10 p-4 mx-4 mt-4">
      <span class="material-symbols-outlined text-lg text-accent-primary -ml-2">
        campaign
      </span>
      <p>Hoy es día de pecho 💪</p>
    </div>

    <!-- Header -->
    <div class="flex items-start justify-between p-6 pb-4">
      <h1 class="text-3xl font-bold leading-tight text-text-primary">
        Bienvenido, {{ athleteName }}
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
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Example data
const athleteName = ref('Gorila')

// Dashboard action cards
const cards = [
  { title: 'Ver tu suscripción', icon: 'credit_card', action: 'subscription' },
  { title: 'Contactar al entrenador', icon: 'chat', action: 'contact' },
  { title: 'Ver próximos entrenamientos', icon: 'calendar_month', action: 'workouts' },
]

const goToSettings = () => {
  // Navigate or open settings modal
  console.log('Settings clicked')
}

const handleCardClick = (action) => {
  console.log('Card clicked:', action)
}
</script>

<style scoped>
.gorila-dashboard {
  /* Forzamos el tema oscuro para aislarlo de estilos globales */
  background-color: #0E0E0E !important;
  color: #EAEAEA !important;
  font-family: 'Inter', sans-serif;
}
</style>
