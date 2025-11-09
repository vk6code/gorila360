<template>
  <div class="flex flex-col min-h-screen bg-[#0E0E0E] text-[#EAEAEA] pb-28 px-5 pt-6">
    <!-- Scrollable content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Header -->
      <header class="flex items-center justify-between mb-6">
        <span class="material-symbols-outlined text-3xl opacity-0">menu</span>
        <h1 class="text-2xl font-bold leading-tight tracking-[-0.015em]">
          Selecciona Tu Protocolo
        </h1>
        <div class="w-8"></div>
      </header>

      <!-- Tip / suggestion card -->
      <div
        class="flex items-start gap-3 rounded-xl border border-[#C7A64F]/60 bg-[#1A1A1A] p-4 mb-8"
      >
        <span class="material-symbols-outlined text-[#C7A64F] mt-0.5">lightbulb</span>
        <p class="text-sm font-normal text-[#EAEAEA]/90">
          La semana pasada hiciste el Día A. Te sugerimos hacer el Día C hoy para mantener tu rutina equilibrada.
        </p>
      </div>

      <!-- Training day cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <button
          v-for="plan in plans"
          :key="plan.day"
          @click="goToWorkout(plan.day)"
          class="flex flex-col rounded-2xl bg-[#1A1A1A] overflow-hidden shadow-md hover:shadow-lg hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-transform w-full h-[260px]"
        >
          <img
            :src="plan.image"
            alt="Workout image"
            class="w-full h-2/3 object-cover"
          />
          <div class="flex flex-col items-center justify-center text-center p-3 h-1/3">
            <h2 class="text-base font-bold leading-tight text-white">
              {{ plan.title }}
            </h2>
            <p class="text-[0.8rem] text-[#B0B0B0] leading-tight mt-1">
              {{ plan.desc }}
            </p>
          </div>
        </button>
      </div>
    </div>

    <!-- Bottom fixed button -->
    <div class="fixed bottom-20 left-0 w-full flex justify-center px-5">
      <button
        class="w-full sm:max-w-md bg-[#C7A64F] text-black font-bold text-base py-4 rounded-xl shadow-md hover:scale-[1.03] transition-transform"
      >
        Revisar Rendimiento de la Semana Pasada
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const plans = ref([
  {
    day: "A",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAM035mQYgoI763FQU3FA774Xxwb7k0Lhz3QETmF1md5SbXHzKBJcjhDV7uA37zkmTDuG2oXPcyBsjXfvkZ7fM-_MbDSzV-bIiTK47dCyfVWNhMTiiZqXylGyz2_JzOP8Wp234lFhNvIAswOVulb8ATfdCD3lZ3xD2BQBlcGgrS6pkEM1GczQwSc0Bs6O0K4Gr5EOucBMUusyPeyaExs5N_neyQ9oCgT6HHMnaRekKPFo4JZf0DSHsa7k0NshMtV9m1qJuRYEi6IBs",
    title: "DÍA A: Enfoque de Empuje",
    desc: "Pecho, hombros, tríceps.",
  },
  {
    day: "B",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdXUjMc0PdR63jzfFY0RIBWiq4EGi6CBPfgd5cnM78hlZDXnI5trlYsmoGKhD-6aNO68ABRDyEssdswMEdgjs9SPSD6fNgjBQ9TBOE4Cs3iCOjd_TnC8hTJ3lfmqI8etFVlhKMai9hfx8q1KkGOBoO-DGBX_a3Reli9TIZ4dyzFrot6JPwFmvoVwJ_BSQ5QapU5TklZVdxASnYNcFKbmKb9QkJ81xYBJzbMJuphCTyi3z_Ilu7IfDVIFd_bKafhUnmHeFfypd4tmE",
    title: "DÍA B: Enfoque de Tirón",
    desc: "Fuerza de espalda y bíceps.",
  },
  {
    day: "C",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCwLX1YkQ8hxxe2Vyayv8XZRWMkHFcuQ2Vaf1pU10GYSwGYaX_JO0fB24ihULa0ojfgEs_8YDms2LvVmgKYmV4gXqRxCJ5T6yZ2uMMcgddIW1q1U4FTJBurlbLHi6DQqqncH9v84IVD1tGNHntPRRYPH6q4QW-J3c-5gzxPlzt1ZXUVhEj5zNuqrOBLEwFzSWs2Yhy8RguF_rEjTRi40zrdQvfcVDe4aPXZ0Vw_UQuqJpyd9DmZVCITl3AnBfeX6_Z9mKZGfdGvufA",
    title: "DÍA C: Enfoque de Pierna",
    desc: "Potencia y estabilidad del tren inferior.",
  },
  {
    day: "D",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAkHCFqEpTqmnU7vK0fa7f87ziuYyPsfLHDMr7pJvneL7fudZwDMQZNVPuZ84t_QjRehIfkiuWGZs8Zl3MxWMJMskg_kDMTHZDv6fWhSNHALFyuyZIxoFQQGoWAXjyp5Nnezz3ZPAUFCvYWsXI0rzx7A_F72o13dghe22SF1mvuY0ok7DhRqUqKD7ZLFBtKvduwdV2YjS-GE8qHWA_uXisAv_qmsokrusnCg-vXkNlba-QiKNKg8Qu1n3rd4F3wjTuonbQ5uOtPwxs",
    title: "DÍA D: Cuerpo Completo",
    desc: "Todos los grupos musculares principales.",
  },
]);

function goToWorkout(day) {
  router.push({ name: "workout-day", params: { day: day.toLowerCase() } });
}
</script>

<style scoped>
button h2,
button p {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}
</style>
