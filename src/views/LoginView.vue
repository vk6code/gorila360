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

      <!-- BOTÓN LOGIN -->
      <button
        type="submit"
        class="btn h-12 mt-2 rounded-md text-black font-extrabold tracking-wider text-sm active:scale-[0.97] transition-all"
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import logo from "@/assets/images/logo-gc.png";

const router = useRouter();

// --- 1. Referencias para los campos del formulario ---
const email = ref("");
const password = ref("");

// --- 2. Definición de la mutación de GraphQL para el login ---
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    # El nombre de la mutación 'tokenAuth' puede variar según tu backend
    tokenAuth(email: $email, password: $password) {
      token
      user {
        name
      }
    }
  }
`;

// --- 3. Hook para ejecutar la mutación ---
const { mutate: loginUser, loading, error, onDone } = useMutation(LOGIN_MUTATION);

// --- 4. Callback que se ejecuta si el login es exitoso ---
onDone(result => {
  const token = result.data.tokenAuth.token;
  const userName = result.data.tokenAuth.user.name;

  localStorage.setItem("authToken", token); // Guardamos el token para futuras peticiones
  localStorage.setItem("userName", userName); // Guardamos el nombre del usuario
  localStorage.setItem("loggedIn", true); // Mantenemos tu flag de sesión
  router.push("/app/dashboard");
});

function handleLogin() {
  loginUser({
    email: email.value,
    password: password.value,
  });
}

function bypassLogin() {
  localStorage.setItem("guestMode", true);
  router.push("/app/dashboard");
}
</script>
