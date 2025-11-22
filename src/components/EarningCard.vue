<template>
  <div
    class="bg-white shadow rounded-xl p-5 border-t-4"
    :class="{
      'border-blue-500': !color,
      'border-green-500': color === 'green',
      'border-yellow-500': color === 'yellow'
    }"
    style="background-color:#1A1A1A;"
  >
    <p class="text-xs font-semibold text-gray-500">{{ title }}</p>
    <h3 class="text-2xl font-bold text-gray-700 mt-1">{{ value }}</h3>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  color: String
})
</script>
