<template>
  <Calendar v-model="visibleDate" :events="events" @create-event="createEvent" @event-click="openEvent" />
</template>

<script setup>
import Calendar from '@/components/Calendar.vue'
import { ref } from 'vue'

const visibleDate = ref(new Date().toISOString().slice(0,10))
const events = ref([
  { id: 1, title: 'Pecho I', start: '2025-11-25T10:00:00', end: '2025-11-25T11:00:00', color: '#EF4444' },
  { id: 2, title: 'Triceps II', start: '2025-11-25T11:00:00', end: '2025-11-25T12:00:00', color: '#EF4444' },
  { id: 3, title: 'Cardio IV', start: '2025-11-25T12:00:00', end: '2025-11-25T13:00:00', color: '#EF4444' },
  { id: 4, title: 'Espalda I', start: '2025-11-06T10:00:00', end: '2025-11-06T11:00:00', color: 'green' },
  { id: 5, title: 'Hombro II', start: '2025-11-07T11:00:00', end: '2025-11-07T12:00:00', color: 'yellow' },
  { id: 6, title: 'Biceps IV', start: '2025-11-08T12:00:00', end: '2025-11-08T13:00:00', color: 'purple' },
  { id: 7, title: 'Entrega', start: '2025-11-28T09:00:00' }
])

function createEvent(isoDate) { /* abre modal y crea evento */ }
function openEvent(payload) { /* payload */ }
</script>