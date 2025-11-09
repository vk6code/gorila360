<template>
  <div
    class="flex min-h-screen w-full flex-col items-center justify-center bg-[#0E0E0E] text-white font-[Montserrat] px-6"
  >
    <!-- LOGO -->
    <div class="flex flex-col items-center justify-center mb-8">
      <img
        :src="logo" 
        alt="GC Natural Elite Team Logo"
        class="w-[85%] max-w-[220px] h-auto object-contain drop-shadow-[0_0_12px_#C7A64F]"
      />
    </div>

    <!-- FORM -->
    <form
      @submit="handleLogin"
      class="flex flex-col w-full max-w-sm gap-6 text-white"
    >
      <!-- EMAIL -->
      <div class="flex flex-col">
        <label
          for="email"
          class="text-sm uppercase font-extrabold text-[#F5F5F5] pb-1 tracking-[0.08em] hover:text-[#C7A64F]/90 transition-colors"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Introduce tu email"
          class="h-13 w-full rounded-md bg-[#151515] border border-[#2a2a2a] px-4 text-[#FAFAFA] placeholder-[#C0C0C0]/70 focus:outline-none focus:ring-2 focus:ring-[#C7A64F]/80 focus:border-transparent transition font-semibold tracking-wide"
        />
      </div>

      <!-- PASSWORD -->
      <div class="flex flex-col">
        <label
          for="password"
          class="text-sm uppercase font-extrabold text-[#F5F5F5] pb-1 tracking-[0.08em] hover:text-[#C7A64F]/90 transition-colors"
        >
          Contraseña
        </label>
        <div class="relative">
          <input
            id="password"
            type="password"
            placeholder="Introduce tu contraseña"
            class="h-13 w-full rounded-md bg-[#151515] border border-[#2a2a2a] px-4 pr-12 text-[#FAFAFA] placeholder-[#C0C0C0]/70 focus:outline-none focus:ring-2 focus:ring-[#C7A64F]/80 focus:border-transparent transition font-semibold tracking-wide"
          />
          <span
            class="material-symbols-outlined absolute right-4 top-3 text-gray-500 cursor-pointer hover:text-gray-300 transition"
          >
            visibility_off
          </span>
        </div>
      </div>

      <!-- BOTÓN LOGIN -->
      <button
        type="submit"
        class="h-12 mt-2 rounded-md bg-[#C7A64F] text-black font-extrabold tracking-wider text-sm hover:bg-[#d4b55b] active:scale-[0.97] transition-all shadow-[0_0_25px_rgba(199,166,79,0.35)]"
      >
        ENTRAR A LA GORILA CREW ELITE
      </button>
    </form>

    <!-- BOTÓN BYPASS -->
    <button
      @click="bypassLogin"
      class="h-12 w-full max-w-sm mt-4 rounded-md border border-[#C7A64F]/50 text-[#C7A64F] font-bold uppercase tracking-wider text-sm hover:bg-[#C7A64F]/10 active:scale-[0.97] transition-all"
    >
      Entrar sin iniciar sesión
    </button>

    <!-- FRASE -->
    <p
      class="text-xs text-[#A5A5A5] text-center pt-8 italic tracking-wide leading-relaxed max-w-[280px]"
    >
      “El que domina su cuerpo, domina su mente.”
    </p>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import logo from "@/assets/images/logo-gc.png";

const router = useRouter();

function handleLogin(e) {
  e.preventDefault();
  localStorage.setItem("loggedIn", true);
  router.push("/dashboard");
}

function bypassLogin() {
  localStorage.setItem("guestMode", true);
  router.push("/dashboard");
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined");

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background: #0e0e0e;
}

button {
  font-family: "Montserrat", sans-serif;
}
</style>
