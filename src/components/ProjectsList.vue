<template>
  <div style="background-color:#1A1A1A;">
    <div v-for="p in projects" :key="p.name" class="mb-4">
      <div class="flex justify-between text-sm font-medium">
        <span>{{ p.name }}</span>
        <span>{{ p.value }}%</span>
      </div>

      <div class="w-full h-2 bg-gray-200 rounded">
        <div class="h-full rounded"
          :class="p.color"
          :style="{ width: p.value + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const projects = [
  { name: "Server Migration", value: 20, color: "bg-red-500" },
  { name: "Sales Tracking", value: 40, color: "bg-yellow-400" },
  { name: "Customer Database", value: 60, color: "bg-blue-500" },
  { name: "Payout Details", value: 80, color: "bg-indigo-500" }
]
</script>
