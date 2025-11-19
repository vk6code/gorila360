<template>
  <div class="flex flex-col p-6 font-display text-text-primary">
    <div class="flex items-center">
      <button @click="goBack" class="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
        <span class="material-symbols-outlined">
          arrow_back
        </span>
      </button>
      <h1 class="text-heading-lg font-bold ml-2">
        Progreso
      </h1>
    </div>
    <div class="bg-[#0d0d0d] rounded-2xl p-5 space-y-5">
      <!-- Tabs -->
      <div class="flex gap-3">
        <!-- Tab activa -->
        <button class="px-4 py-1.5 rounded-full bg-[#3a2f16] text-[#d6a94f] font-medium text-sm">
          Peso
        </button>

        <button class="px-4 py-1.5 rounded-full bg-[#1a1a1a] text-gray-300 font-medium text-sm">
          Volumen
        </button>

        <button class="px-4 py-1.5 rounded-full bg-[#1a1a1a] text-gray-300 font-medium text-sm">
          Grasa
        </button>
      </div>

      <!-- Performance Trends -->
      <div class="space-y-2">
        <p class="text-gray-300 text-sm font-medium">Tendencia de rendimiento</p>
        <p class="text-white text-4xl font-bold">88 kgs</p>
        <p class="text-gray-400 text-sm">
          Últimos 30 días
          <span class="text-green-400 font-semibold">+5 kgs</span>
        </p>
      </div>

    </div>
    <p class="mt-4 text-text-secondary">
      <apexchart
        type="line"
        height="250"
        :options="chartOptions"
        :series="series"
      />
    </p>
  </div>
  <div class="space-y-3 pb-64">

    <div class="bg-[#111] rounded-2xl px-5 py-4 shadow-inner">
      <p class="text-gray-400 text-sm">Peso actual</p>
      <p class="text-white text-2xl font-semibold">88 kgs</p>
    </div>

    <div class="bg-[#111] rounded-2xl px-5 py-4 shadow-inner">
      <p class="text-gray-400 text-sm">Porcentaje conseguido</p>
      <p class="text-white text-2xl font-semibold">75%</p>
    </div>

    <div class="bg-[#111] rounded-2xl px-5 py-4 shadow-inner">
      <p class="text-gray-400 text-sm">Próximo objetivo</p>
      <p class="text-white text-2xl font-semibold">92 kgs</p>
    </div>

  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};

const series = ref([
  {
    name: "Peso",
    data: [75, 79, 73, 83, 85, 81, 88] // Tus datos
  }
]);

const chartOptions = ref({
  chart: {
    background: "#0d0d0d",
    toolbar: { show: false },
    zoom: {
      enabled: false
    }
  },
  stroke: {
    curve: "smooth",
    width: 3
  },
  colors: ["#f5d742"], // Amarillo
  xaxis: {
    categories: ["Semana 1", "Semana 2", "Semana 3", "Semana 4", "Semana 5", "Semana 6", "Semana 7"],
    labels: { 
      show: true,
      style: {
        colors: "#aaa"
      } 
    },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      show: true,
      style: { colors: "#aaa" }
      // formatter: (value) => `${value} lbs`
    }
  },
  grid: {
    show: false
  },
  tooltip: {
  custom: function({ series, seriesIndex, dataPointIndex, w }) {
    const value = series[seriesIndex][dataPointIndex];
    return `
      <div style="
        background:#1b1b1b;
        padding:8px 12px;
        border-radius:10px;
        color:white;
        font-size:14px;
      ">
        ${value} lbs
      </div>
    `;
  }
}
});
</script>

<style>
/* Opcional: bordes redondeados como en la tarjeta de tu app */
.apexcharts-canvas {
  border-radius: 20px;
}
</style>