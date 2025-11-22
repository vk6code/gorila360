<template>
  <Doughnut :data="chartData" :options="chartOptions" style="background-color:#1A1A1A;" />
</template>

<script setup>
import { Doughnut } from "vue-chartjs"
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js"

Chart.register(ArcElement, Tooltip, Legend)

const chartData = {
  labels: ["Direct", "Social", "Referral"],
  datasets: [{
    data: [55, 30, 15],
    backgroundColor: [
        "#4e73df", // Azul
        "#1cc88a", // Verde
        "#36b9cc"  // Celeste
    ],
  }]
}

const chartOptions = {
  responsive: true
}
</script>
