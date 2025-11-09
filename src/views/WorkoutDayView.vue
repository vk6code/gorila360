<template>
  <div class="p-6 font-display text-text-primary animate-fade-in">
    <div class="flex items-center mb-6">
      <button @click="goBack" class="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
        <span class="material-symbols-outlined">
          arrow_back
        </span>
      </button>
      <h1 class="text-heading-lg font-bold ml-2">
        Rutina del Día {{ day.toUpperCase() }}
      </h1>
    </div>

    <div class="space-y-6">
      <div v-for="exercise in exercises" :key="exercise.name" class="bg-[#1A1A1A] p-5 rounded-xl">
        <h2 class="text-heading-md font-semibold text-accent-primary">{{ exercise.name }}</h2>
        <p class="text-text-secondary mt-2">{{ exercise.sets }} x {{ exercise.reps }}</p>
        <p v-if="exercise.notes" class="text-sm text-text-secondary/80 mt-2 italic">{{ exercise.notes }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  day: {
    type: String,
    required: true,
  },
});

const router = useRouter();

const goBack = () => {
  router.push({ name: 'plans' });
};

const workoutData = {
  a: [
    { name: 'Press de Banca', sets: 4, reps: '8-12', notes: 'Foco en la contracción del pectoral.' },
    { name: 'Press Inclinado con Mancuernas', sets: 3, reps: '10-15' },
    { name: 'Elevaciones Laterales', sets: 4, reps: '12-20', notes: 'Controlar la fase excéntrica.' },
    { name: 'Extensiones de Tríceps en Polea', sets: 3, reps: '10-15' },
  ],
  b: [{ name: 'Dominadas', sets: 4, reps: 'Al fallo' }, { name: 'Remo con Barra', sets: 4, reps: '8-12' }],
  c: [{ name: 'Sentadillas', sets: 5, reps: '5-8' }, { name: 'Prensa', sets: 4, reps: '10-15' }],
  d: [{ name: 'Face Pulls', sets: 4, reps: '15-20' }, { name: 'Curl de Bíceps', sets: 3, reps: '10-15' }],
};

const exercises = computed(() => workoutData[props.day] || []);
</script>

<style scoped>
.animate-fade-in { animation: fade-in 0.3s ease-in-out; }
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>