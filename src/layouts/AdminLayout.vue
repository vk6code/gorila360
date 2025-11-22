<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />

    <div class="flex flex-col flex-1">
      <Navbar />
      <main class="p-6 gorila-dashboard">
        <router-view />
      </main>
    </div>
  </div>
</template>
<script setup>
    import Sidebar from "../components/Sidebar.vue";
</script>
<style scoped>
    .gorila-dashboard {
    /* Forzamos el tema oscuro para aislarlo de estilos globales */
    background-color: #0E0E0E !important;
    color: #EAEAEA !important;
    font-family: 'Inter', sans-serif;
    height: 100%;
    }
</style>