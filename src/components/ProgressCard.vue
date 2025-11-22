<template>
  <div class="shadow rounded-xl p-5 border-t-4 border-cyan-500" style="background-color:#1A1A1A;">
    <p class="text-xs font-semibold text-gray-500">{{ title }}</p>
    <div class="flex items-center gap-3 mt-2">
      <span class="font-bold text-xl">{{ progress }}%</span>
      <div class="w-full h-2 bg-gray-200 rounded">
        <div class="h-full bg-cyan-500 rounded" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  progress: Number
})
</script>
