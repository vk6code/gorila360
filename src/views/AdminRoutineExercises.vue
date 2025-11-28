<template>
    <div class="max-w-7xl py-3">
      <div class="hidden md:flex gap-6 text-sm font-medium">
        <RouterLink
            to="/admin/rutinas/ejercicios"
            class="flex items-center p-3 rounded-xl text-white hover:bg-gray-700 transition group bg-[#1A1A1A]"
          >
            <span>Ejercicios</span>
        </RouterLink>

        <RouterLink
            to="/admin/rutinas/workouts"
            class="flex items-center p-3 rounded-xl text-white hover:bg-gray-700 transition group bg-[#1A1A1A]"
          >
            <span>WorkOuts</span>
        </RouterLink>
      </div>
    </div>
    <div>
      <router-view />
    </div>
</template>
<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

<style scoped>
/* Ajusta altura, colores o sombras aquí si lo necesitas */
</style>
