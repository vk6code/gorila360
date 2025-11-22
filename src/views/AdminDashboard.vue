<template>
<h2 class="text-3xl font-bold">Escritorio</h2>

  <div class="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
    <!-- Top Cards -->
    <EarningCard title="EARNINGS (MONTHLY)" value="$40,000" icon="calendar" />
    <EarningCard title="EARNINGS (ANNUAL)" value="$215,000" icon="dollar-sign" color="green" />
    <ProgressCard title="TASKS" progress="50" icon="clipboard" />
    <EarningCard title="PENDING REQUESTS" value="18" icon="message-circle" color="yellow" />

    <!-- Earnings Chart -->
    <div class="lg:col-span-3">
      <ChartCard title="Earnings Overview">
        <LineChart />
      </ChartCard>
    </div>

    <!-- Doughnut Chart -->
    <ChartCard title="Revenue Sources">
      <DoughnutChart />
    </ChartCard>

  </div>
</template>

<script setup>
import EarningCard from "../components/EarningCard.vue"
import ProgressCard from "../components/ProgressCard.vue"
import ChartCard from "../components/ChartCard.vue"
import LineChart from "../components/LineChart.vue"
import DoughnutChart from "../components/DoughnutChart.vue"
import ProjectsList from "../components/ProjectsList.vue"
</script>
