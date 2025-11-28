<template>
  <h2 class="text-3xl font-bold">Alumnos</h2>
  <DataTable :items="items" :columns="columns" @row-click="rowClicked" class="mt-4" />

  <ModalComponent v-model="showModal" title="Detalles del alumno">
    <p>{{ userName }}</p>
    <p>{{ userAge }}</p>
    <p>{{ userCity }}</p>
    <template #footer>
      <button @click="showModal = false">Cerrar</button>
      <!-- <button @click="confirmar">Confirmar</button> -->
    </template>
  </ModalComponent>
</template>

<script setup>
import DataTable from "../components/DataTable.vue"
import ModalComponent  from "../components/Modal.vue"
import { ref } from 'vue'

const showModal = ref(false)
const userName = ref('')
const userAge = ref('')
const userCity = ref('')

const columns = [
  { key: "name", label: "Nombre" },
  { key: "age", label: "Edad" },
  { key: "city", label: "Ciudad" },
  { key: "lastTraining", label: "Último entreno" },
]

const items = [
  { name: "Ana", age: 28, city: "Madrid", lastTraining: "Ayer" },
  { name: "Luis", age: 35, city: "Sevilla", lastTraining: "2 días" },
  { name: "María", age: 22, city: "Valencia", lastTraining: "1 mes" },
  { name: "Carlos", age: 40, city: "Barcelona", lastTraining: "5 días" },
  { name: "Carlos", age: 40, city: "Barcelona", lastTraining: "Hoy" },
]

function rowClicked(event)
{
    userName.value = event.row.name
    userAge.value = event.row.age
    userCity.value = event.row.city
    showModal.value = true
}
</script>
