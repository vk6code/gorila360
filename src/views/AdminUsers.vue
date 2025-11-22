<template>
  <h2 class="text-3xl font-bold">Alumnos</h2>
  <DataTable :items="items" :columns="columns" class="mt-4" />
</template>

<script setup>
import DataTable from "../components/DataTable.vue"

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
</script>
