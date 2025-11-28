<script setup>
import { ref, computed } from "vue"

const props = defineProps({
  items: { type: Array, required: true },
  columns: { type: Array, required: true }, // { key: 'name', label: 'Nombre' }
})

const emit = defineEmits(["row-click"])

const search = ref("")
const sortKey = ref("")
const sortAsc = ref(true)
const currentPage = ref(1)
const perPage = 5

const filtered = computed(() => {
  const term = search.value.toLowerCase()
  return props.items.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(term)
    )
  )
})

const sorted = computed(() => {
  if (!sortKey.value) return filtered.value
  return [...filtered.value].sort((a, b) => {
    const valA = a[sortKey.value]
    const valB = b[sortKey.value]
    if (valA < valB) return sortAsc.value ? -1 : 1
    if (valA > valB) return sortAsc.value ? 1 : -1
    return 0
  })
})

const paginated = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return sorted.value.slice(start, start + perPage)
})

function sort(col) {
  if (sortKey.value === col) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = col
    sortAsc.value = true
  }
}

function onRowClick(row, index) {
  emit("row-click", { row, index })
}
</script>

<template>
  <div class="p-4 bg-white rounded-xl shadow" style="background-color:#1A1A1A;">
    <!-- Search -->
    <input
      v-model="search"
      type="text"
      placeholder="Buscar..."
      class="mb-3 w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
    />

    <!-- Table -->
    <table class="min-w-full text-left" style="background-color:#1A1A1A;">
      <thead>
        <tr class="border-b">
          <th
            v-for="col in columns"
            :key="col.key"
            class="py-2 px-3 cursor-pointer select-none"
            @click="sort(col.key)"
          >
            {{ col.label }}
            <span v-if="sortKey === col.key">
              {{ sortAsc ? "▲" : "▼" }}
            </span>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(row, i) in paginated"
          :key="i"
          class="border-b hover:bg-gray-700"
          @click="onRowClick(row, i)"
        >
          <td v-for="col in columns" :key="col.key" class="py-2 px-3">
            {{ row[col.key] }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="flex justify-between mt-4">
      <button
        class="px-3 py-1 border rounded disabled:opacity-50"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        Anterior
      </button>

      <span>Página {{ currentPage }}</span>

      <button
        class="px-3 py-1 border rounded disabled:opacity-50"
        :disabled="currentPage * perPage >= filtered.length"
        @click="currentPage++"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>
