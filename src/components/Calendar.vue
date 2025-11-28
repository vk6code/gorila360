<template>
  <div class="w-full h-full mx-auto p-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <button @click="prevMonth" class="p-2 rounded-md hover:bg-gray-100">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="text-lg font-semibold">{{ capitalize(format(currentDate, 'MMMM yyyy', { locale: es })) }}</div>
        <button @click="nextMonth" class="p-2 rounded-md hover:bg-gray-100">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 6l6 6-6 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>

      <!-- <div class="flex items-center gap-2">
        <button @click="today" class="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-black">Hoy</button>
      </div> -->
    </div>

    <!-- Weekday headers -->
    <div class="grid grid-cols-7 text-sm text-gray-600 border-b pb-2">
      <div v-for="(wd, idx) in weekdays" :key="idx" class="text-center font-medium">{{ wd }}</div>
    </div>

    <!-- Days grid -->
    <div class="grid grid-cols-7 gap-1 mt-2">
      <div v-for="(day, idx) in calendarDays" :key="idx"
           :class="[
             'min-h-[150px] p-2 rounded-lg flex flex-col',
             !isSameMonth(day, currentDate) ? 'bg-gray-50 text-gray-400' : 'bg-white',
             isSameDay(day, todayDate) ? 'ring-2 ring-indigo-300' : ''
           ]">

        <div class="flex items-start justify-between mb-2">
          <div class="text-xs font-medium text-black">{{ format(day, 'd') }}</div>
          <button @click="onDayCreate(day)" class="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">+</button>
        </div>

        <div class="flex-1 overflow-hidden">
          <div class="flex flex-col gap-1">
            <div v-for="ev in eventsForDay(day)" :key="ev.id" @click.stop="onEventClick(ev, day)"
                 class="text-xs p-1 rounded-md shadow-md cursor-pointer truncate"
                 :style="eventStyle(ev)">
              <div class="font-semibold text-[11px] truncate text-black">{{ ev.title }}</div>
              <div class="text-[10px] opacity-80 text-black">{{ timeRange(ev) }}</div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, toRefs, watch } from 'vue'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

// Props
const props = defineProps({
  modelValue: { type: String, default: () => format(new Date(), 'yyyy-MM-dd') },
  events: { type: Array, default: () => [] },
  weekStartsOn: { type: Number, default: 1 } // 0 = Sunday, 1 = Monday
})

const emit = defineEmits(['update:modelValue', 'day-click', 'event-click', 'create-event'])

const { modelValue, events } = toRefs(props)

const currentDate = ref(parseISO(modelValue.value))
const todayDate = new Date()

// Keep currentDate in sync with parent v-model
watch(() => modelValue.value, (v) => {
  try { currentDate.value = parseISO(v) } catch (e) { currentDate.value = new Date(v) }
})

watch(currentDate, (v) => emit('update:modelValue', format(v, 'yyyy-MM-dd')))

// Weekday labels
const weekdays = computed(() => {
  // Spanish short names - adapt as you like
  const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  // If weekStartsOn is 0 (Sunday), rotate
  if (props.weekStartsOn === 0) return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  return labels
})

// Build calendar day grid (6 weeks) for current month
const calendarDays = computed(() => {
  const start = startOfWeek(startOfMonth(currentDate.value), { weekStartsOn: props.weekStartsOn })
  const end = endOfWeek(endOfMonth(currentDate.value), { weekStartsOn: props.weekStartsOn })
  const days = []
  let cursor = start
  while (cursor <= end) {
    days.push(cursor)
    cursor = addDays(cursor, 1)
  }
  return days
})

function eventsForDay(day) {
  // events prop expects: { id, title, start: ISO, end: ISO?, color? }
  return props.events.filter(ev => {
    const s = typeof ev.start === 'string' ? parseISO(ev.start) : ev.start
    return isSameDay(s, day)
  })
}

function timeRange(ev) {
  if (!ev.start) return ''
  const s = typeof ev.start === 'string' ? parseISO(ev.start) : ev.start
  const e = ev.end ? (typeof ev.end === 'string' ? parseISO(ev.end) : ev.end) : null
  return e ? `${format(s, 'HH:mm')} - ${format(e, 'HH:mm')}` : format(s, 'HH:mm')
}

function eventStyle(ev) {
  const color = ev.color || '#3B82F6' // default indigo-500
  return {
    borderLeft: `4px solid ${color}` ,
    background: '#fff',
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}


function prevMonth() { currentDate.value = subMonths(currentDate.value, 1) }
function nextMonth() { currentDate.value = addMonths(currentDate.value, 1) }
function today() { currentDate.value = new Date() }

function onDayCreate(day) {
  emit('create-event', format(day, "yyyy-MM-dd"))
}

function onEventClick(ev, day) {
  emit('event-click', { event: ev, day: format(day, 'yyyy-MM-dd') })
}
</script>

<style scoped>
/* Minimal overrides to better match FullCalendar-like compactness */
</style>
