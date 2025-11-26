<template>
  <div class="p-10 text-white font-bold text-xl">
    <h1>Diet View Debug</h1>
    <p>If you see this, the component mounted successfully.</p>
    <p>Check console for store logs.</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDietStore } from '@/stores/diet'
import { useAuth } from '@/stores/auth'

console.log('--- MOUNTING DIET VIEW ---')

try {
  const auth = useAuth()
  console.log('Auth Store:', auth)

  const dietStore = useDietStore()
  console.log('Diet Store:', dietStore)

  onMounted(() => {
    console.log('DietView Mounted')
    if (dietStore) {
      console.log('Calling loadFromLocal...')
      dietStore.loadFromLocal()
      console.log('Calling sync...')
      dietStore.sync()
    }
  })
} catch (e) {
  console.error('CRITICAL ERROR IN SETUP:', e)
}
</script>
