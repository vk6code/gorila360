<template>
  <Calendar v-model="visibleDate" :events="events" @create-event="createEvent" @event-click="openEvent" />

    <ModalComponent v-model="showModal" :title="selectedDate">
      <p> Añadir Evento </p>
      <template #footer>
        <button @click="showModal = false">Cerrar</button>
        <!-- <button @click="confirmar">Confirmar</button> -->
      </template>
    </ModalComponent>

    <ModalComponent v-model="showModalEvento" :title="selectedDate">
      <p> Ver Evento</p>
      <template #footer>
        <button @click="showModalEvento = false">Cerrar</button>
        <!-- <button @click="confirmar">Confirmar</button> -->
      </template>
    </ModalComponent>
</template>

<script setup>
import Calendar from '@/components/Calendar.vue'
import ModalComponent  from "@/components/Modal.vue"
import { ref } from 'vue'

const selectedDate = ref()
const showModal = ref(false)
const showModalEvento = ref(false)

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

function createEvent(isoDate) { 
  selectedDate.value = formatFecha(isoDate);
  showModal.value = true
}
function openEvent(payload) { 
  selectedDate.value = formatFecha(payload.day);
  showModalEvento.value = true
}

function formatFecha(fecha) {
  const date = new Date(fecha) // recibe "YYYY-MM-DD"

  const opciones = {
    day: "numeric",
    month: "long",
  }

  // Día + mes en español
  let formateado = new Intl.DateTimeFormat("es-ES", opciones).format(date)

  const partes = formateado.split(" de ")

  const dia = partes[0]        // "30"
  const mes = partes[1]        // "octubre"

  // Capitalizar solo el mes
  const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1)

  return `${dia} de ${mesCapitalizado}`
}
</script>