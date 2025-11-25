<template>
  <div
    class="flex min-h-screen w-full flex-col items-center justify-center bg-[#0E0E0E] text-white font-[Montserrat] px-6"
  >
    <!-- LOGO -->
    <div class="flex flex-col items-center justify-center mb-8">
      <img
        :src="logo"
        alt="GC Natural Elite Team Logo"
        class="w-[95%] max-w-[240px] h-auto object-contain drop-shadow-[0_0_12px_#C7A64F]"
      />
    </div>

    <!-- FORM -->
    <form
      @submit.prevent="handleLogin"
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
          v-model="email"
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
            v-model="password"
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

      <!-- ERROR MESSAGE -->
      <div v-if="errorMessage" class="text-red-500 text-sm text-center font-bold bg-red-900/20 p-2 rounded border border-red-900/50">
        {{ errorMessage }}
      </div>

      <!-- BOTÓN LOGIN -->
      <button
        type="submit"
        :disabled="isLoading"
        class="btn h-12 mt-2 rounded-md text-black font-extrabold tracking-wider text-sm active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isLoading">CARGANDO...</span>
        <span v-else>ENTRAR A LA GORILA CREW ELITE</span>
      </button>
    </form>

    <!-- DIVIDER -->
    <div class="relative w-full max-w-sm my-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-[#2a2a2a]"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-[#0E0E0E] text-[#A5A5A5]">o continúa con</span>
      </div>
    </div>

    <!-- BOTONES OAUTH - Pequeños y Cuadrados -->
    <div class="flex justify-center gap-4 w-full max-w-sm">
      <!-- Botón Google -->
      <!-- Botón Google -->
      <a
        href="https://gorila360.es/auth/google"
        class="w-14 h-14 rounded-lg bg-[#151515] hover:bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center active:scale-95 transition-all shadow-md group"
        title="Continuar con Google"
      >
        <svg class="w-6 h-6 text-[#C7A64F] group-hover:text-[#D4B55F] transition-colors" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      </a>

      <!-- Botón Facebook -->
      <a
        href="https://gorila360.es/auth/facebook"
        class="w-14 h-14 rounded-lg bg-[#151515] hover:bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center active:scale-95 transition-all shadow-md group"
        title="Continuar con Facebook"
      >
        <svg class="w-7 h-7 text-[#C7A64F] group-hover:text-[#D4B55F] transition-colors" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </a>

      <!-- Botón Instagram -->
      <a
        href="https://gorila360.es/auth/instagram"
        class="w-14 h-14 rounded-lg bg-[#151515] hover:bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center active:scale-95 transition-all shadow-md group"
        title="Continuar con Instagram"
      >
        <svg class="w-6 h-6 text-[#C7A64F] group-hover:text-[#D4B55F] transition-colors" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </a>
    </div>

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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import logo from "@/assets/images/logo-gc.png";
import { useAuth } from "@/stores/auth";

const router = useRouter();
const { setToken } = useAuth();

// --- 1. Referencias para los campos del formulario ---
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isLoading = ref(false);

// --- 2. Capturar token de OAuth desde URL ---
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (token) {
    setToken(token);
    // Limpiar URL y redirigir
    window.history.replaceState({}, '', '/app/dashboard');
    router.push('/app/dashboard');
  }
});

// --- 3. Función de Login (REST API) ---
async function handleLogin() {
  errorMessage.value = "";
  isLoading.value = true;

  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Error al iniciar sesión');
    }

    const token = data.access_token;

    // Guardar token usando el store
    setToken(token);

    // Opcional: Guardar flag de sesión (aunque useAuth ya maneja el token)
    localStorage.setItem("loggedIn", true);

    // Redirigir
    router.push("/app/dashboard");

  } catch (error) {
    console.error("Login error:", error);
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
}

function bypassLogin() {
  localStorage.setItem("guestMode", true);
  router.push("/app/dashboard");
}
</script>
