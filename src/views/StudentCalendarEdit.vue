<template>
  <div class="min-h-screen bg-[#0E0E0E] text-white p-4">
    <header class="flex items-center justify-between mb-6">
      <button @click="$router.back()" class="p-2 rounded-full bg-[#141414] border border-[#333]">
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <h1 class="text-lg font-bold uppercase tracking-wider">Editar Planificación</h1>
      <div class="w-10"></div> <!-- Spacer -->
    </header>

    <div class="text-center py-10">
      <p class="text-gray-400 mb-4">Arrastra los tipos de día para planificar tu mes.</p>
      <div class="p-4 border border-dashed border-[#333] rounded-xl bg-[#141414]">
        <p class="text-sm text-[#C7A64F]">Funcionalidad de Drag & Drop en construcción...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Placeholder for Drag and Drop logic
</script>
