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

    <!-- Contenedor para el vídeo/gif del ejercicio -->
    <div class="aspect-video bg-[#1A1A1A] rounded-xl flex items-center justify-center mb-6">
      <p class="text-text-secondary">Aquí va el vídeo del ejercicio</p>
    </div>

    <!-- Descripción del ejercicio -->
    <div>
      <h2 class="text-heading-md font-semibold text-accent-primary">Descripción</h2>
      <p class="text-text-secondary mt-2">
        Acuéstate en un banco plano. Agarra la barra con las manos un poco más anchas que el ancho de los hombros. Baja la barra lentamente hasta el pecho y luego súbela de nuevo a la posición inicial.
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>