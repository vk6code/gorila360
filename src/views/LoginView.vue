<template>
  <div
    class="flex min-h-screen w-full flex-col items-center justify-center bg-[#0b0b0b] text-white font-display p-4"
  >
    <div class="flex w-full max-w-sm flex-col items-center gap-8">
      <!-- Logo -->
      <!-- Logo -->
        <div class="flex items-center justify-center">
            <img 
            src="/src/assets/logo-gc.png" 
            alt="Gorila Crew Elite Logo" 
            class="w-28 h-28 object-contain drop-shadow-lg"
             />
        </div>

        <p class="uppercase tracking-[0.3em] text-[#9a8c58] text-xs mt-[-12px]">
          crew elite
        </p>
      </div>

      <!-- Form -->
      <form @submit="handleLogin" class="flex w-full flex-col gap-6">
        <div class="flex flex-col">
          <label
            for="email"
            class="text-sm font-medium text-gray-400 pb-2 tracking-wide"
            >Email</label
          >
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            class="h-12 w-full rounded-md bg-[#141414] border border-[#2a2a2a] px-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C7A64F] focus:border-transparent transition"
          />
        </div>

        <div class="flex flex-col">
          <label
            for="password"
            class="text-sm font-medium text-gray-400 pb-2 tracking-wide"
            >Password</label
          >
          <div class="relative">
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              class="h-12 w-full rounded-md bg-[#141414] border border-[#2a2a2a] px-4 pr-12 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C7A64F] focus:border-transparent transition"
            />
            <span
              class="material-symbols-outlined absolute right-4 top-3 text-gray-500 cursor-pointer hover:text-gray-300"
            >
              visibility_off
            </span>
          </div>
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          class="h-12 mt-2 rounded-md bg-[#C7A64F] text-black font-bold tracking-wide hover:bg-[#d4b55b] active:scale-95 transition-all shadow-[0_0_15px_rgba(199,166,79,0.25)]"
        >
          ENTRAR A LA GORILA CREW ELITE
        </button>
      </form>

      <!-- Bypass Button -->
      <button
        @click="bypassLogin"
        class="h-12 w-full rounded-md border border-[#C7A64F]/50 text-[#C7A64F] font-medium tracking-wide hover:bg-[#C7A64F]/10 active:scale-95 transition-all"
      >
        Entrar sin iniciar sesión
      </button>

      <!-- Quote -->
      <p class="text-sm text-gray-500 text-center pt-4">
        El que domina su cuerpo, domina su mente.
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function handleLogin(e) {
  e.preventDefault()
  localStorage.setItem('loggedIn', true)
  router.push('/dashboard')
}

function bypassLogin() {
  localStorage.setItem('guestMode', true)
  router.push('/dashboard')
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined");
</style>
