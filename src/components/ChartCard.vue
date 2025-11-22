<template>
  <div class="rounded-xl shadow p-5" style="background-color:#1A1A1A;">
    <div class="flex justify-between mb-4">
      <h2 class="font-semibold text-gray-700">{{ title }}</h2>
    </div>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: String
})
</script>