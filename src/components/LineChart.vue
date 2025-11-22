<template>
  <Line :data="chartData" :options="chartOptions" style="background-color:#1A1A1A;" />
</template>

<script setup>
import { Line } from "vue-chartjs"
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
} from "chart.js"

Chart.register(LineElement, PointElement, LinearScale, CategoryScale)

const chartData = {
  labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov"],
  datasets: [
    {
      label: "Earnings",
      data: [0,10000,5000,15000,10000,20000,15000,25000,20000,30000,40000],
      borderWidth: 3,
      tension: 0.4,
      borderColor: "#ffffff",          // ← línea blanca
      pointBackgroundColor: "#ffffff", // ← puntos blancos
      pointBorderColor: "#ffffff"
    }
  ]
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: {
      ticks: { color: "#ffffff" },
      grid: { color: "rgba(255,255,255,0.2)" }
    },
    x: {
      ticks: { color: "#ffffff" },
      grid: { color: "rgba(255,255,255,0.2)" }
    }
  }
}
</script>
