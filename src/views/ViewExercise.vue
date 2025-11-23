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
        Press de Banca
      </h1>
    </div>

    <div class="flex space-x-3">
      <!-- Current Set -->
      <div class="bg-neutral-900 rounded-xl px-6 py-4 text-center w-28">
        <p class="text-gray-400 text-xs uppercase tracking-wide">Series actuales</p>
        <p class="text-2xl font-semibold mt-2">2 <span class="text-gray-400 text-lg">/ 4</span></p>
      </div>

      <!-- Target Reps -->
      <div class="bg-neutral-900 rounded-xl px-6 py-4 text-center w-28">
        <p class="text-gray-400 text-xs uppercase tracking-wide">Repes</p>
        <p class="text-2xl font-semibold mt-2">8</p>
      </div>

      <!-- Target Weight -->
      <div class="bg-neutral-900 rounded-xl px-6 py-4 text-center w-28">
        <p class="text-gray-400 text-xs uppercase tracking-wide">Peso</p>
        <p class="text-2xl font-semibold mt-2">100 <span class="text-gray-400 text-sm font-medium">KG</span></p>
      </div>
    </div>


      <div class="grid mt-16 text-9xl font-mono mb-6 place-items-center">
        {{ minutes.toString().padStart(2, '0') }}:{{ seconds.toString().padStart(2, '0') }}
      </div>

    <!-- Descripción del ejercicio -->
    <div class="mt-6">
      <h2 class="text-heading-md font-semibold text-accent-primary">Descripción</h2>
      <p class="text-text-secondary mt-2">
        Acuéstate en un banco plano. Agarra la barra con las manos un poco más anchas que el ancho de los hombros. Baja la barra lentamente hasta el pecho y luego súbela de nuevo a la posición inicial.
      </p>
    </div>

    <div class="grid grid-cols-3 mt-12 space-x-3 place-items-center gap-4">
      <div>
        <button
          @click="startCountdown"
          class="text-white px-8 py-4 rounded-lg font-semibold"
          :disabled="running"
          style="border: 1px solid white;"
        >
          <PlayIcon class="w-5 h-5 text-white" />
        </button>
      </div>

      <div>
        <button
          @click="pauseCountdown"
          class="text-white px-8 py-4 rounded-lg font-semibold"
          style="border: 1px solid white;"
        >
          <PauseIcon class="w-5 h-5 text-white" />
        </button>
      </div>

      <div>
        <button
          @click="resetCountdown"
          class="text-white px-8 py-4 rounded-lg font-semibold"
          style="border: 1px solid white;"
        >
          <ArrowPathRoundedSquareIcon class="w-5 h-5 text-white" />
        </button>
      </div>
    </div>

    <!-- Footer Button -->
    <div class="mt-auto flex justify-center">
      <button class="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-full shadow-lg mb-6">
        Finalizar serie/entrenamiento
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router';
import {
  PauseIcon,
  PlayIcon,
  ArrowPathRoundedSquareIcon
} from '@heroicons/vue/24/outline'

const router = useRouter();
const totalTime = ref(120)
const timeLeft = ref(totalTime.value)
const interval = ref(null)
const running = ref(false)

const minutes = computed(() => Math.floor(timeLeft.value / 60))
const seconds = computed(() => timeLeft.value % 60)

const goBack = () => {
  router.back();
};

const startCountdown = () => {
  if (running.value) return
  running.value = true
  interval.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(interval.value)
      running.value = false
    }
  }, 1000)
};

const pauseCountdown = () => {
  clearInterval(interval.value)
  running.value = false
};

const resetCountdown = () => {
  clearInterval(interval.value)
  timeLeft.value = totalTime.value
  running.value = false
};

onUnmounted(() => clearInterval(interval.value))
</script>