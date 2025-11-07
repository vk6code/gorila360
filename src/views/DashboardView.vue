<template>
  <div
    class="min-h-screen bg-[#0E0E0E] text-white flex flex-col items-center justify-center"
  >
    <h1
      class="text-4xl font-bold text-[#C7A64F] mb-6"
    >
      {{ guest ? "Modo Invitado 🦍" : "Bienvenido a la Gorila Crew Elite 🦍" }}
    </h1>

    <p class="text-gray-400 mb-8">
      {{ guest ? "Estás explorando sin iniciar sesión." : "Has accedido al área interna." }}
    </p>

    <button
      @click="logout"
      class="bg-[#C7A64F] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#d4b55b] transition"
    >
      Cerrar sesión
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const guest = ref(false)

onMounted(() => {
  guest.value = !!localStorage.getItem('guestMode')
})

function logout() {
  localStorage.removeItem('loggedIn')
  localStorage.removeItem('guestMode')
  router.push('/')
}
</script>
