<template>
  <div class="flex flex-col min-h-screen bg-[#0E0E0E] pb-20">
    <!-- Header -->
    <div class="px-4 pt-6 pb-3 sticky top-0 bg-[#0E0E0E] z-10 border-b border-[#333333]">
      <div class="flex items-center justify-between mb-4">
        <button @click="$router.push({ name: 'student-calendar' })" class="flex items-center gap-2 text-[#C7A64F] font-bold text-sm uppercase tracking-wider">
          <ArrowLeft class="w-4 h-4" />
          <span>Terminar Edición</span>
        </button>
        <div class="text-xs text-[#5A5A5A]">Arrastra los tipos de día</div>
      </div>

      <!-- Draggable Palette -->
      <div class="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <div
          v-for="type in dayTypes"
          :key="type.name"
          draggable="true"
          @dragstart="onDragStart($event, type)"
          @touchstart.passive="onTouchStart($event, type)"
          class="flex flex-col items-center gap-1 min-w-[60px] cursor-move active:scale-95 transition-transform select-none"
        >
          <div :class="['w-10 h-10 rounded-full flex items-center justify-center shadow-lg', type.colorClass]">
            <span class="text-xs font-bold text-white">{{ type.code }}</span>
          </div>
          <span class="text-[10px] font-medium text-[#5A5A5A]">{{ type.name }}</span>
        </div>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="flex-1 px-4 py-4 relative" ref="calendarGrid">
      <div class="grid grid-cols-7 gap-1.5">
        <!-- Weekday Headers -->
        <div v-for="day in weekdays" :key="day" class="text-center text-[9px] uppercase tracking-[0.12em] text-[#5A5A5A] font-medium pb-1.5">
          {{ day }}
        </div>

        <!-- Day Cards -->
        <div
          v-for="day in calendarDays"
          :key="day.date"
          :data-date="day.date"
          @dragover.prevent
          @drop="onDrop($event, day)"
          :class="[
            'day-cell rounded-xl bg-[#141414] border border-[#333333] p-1.5 flex flex-col justify-between transition-all aspect-square relative',
            !day.isCurrentMonth && 'opacity-30',
            day.isToday && 'border-[#C7A64F] bg-[#C7A64F]/10',
            isDragOver === day.date && 'border-[#C7A64F] bg-[#C7A64F]/20 scale-105 z-10'
          ]"
          @dragenter="isDragOver = day.date"
          @dragleave="isDragOver = null"
        >
          <div class="text-xs font-semibold text-[#FFFFFF] text-center">{{ day.day }}</div>

          <!-- Day Type Indicator -->
          <div class="flex items-center justify-center flex-1 py-1">
            <div
              v-if="day.dayType"
              class="w-full h-full rounded-lg flex items-center justify-center transition-colors duration-300"
              :class="getDayTypeColor(day.dayType)"
            >
              <span class="text-[10px] font-bold text-white">{{ day.dayType }}</span>
            </div>
            <div v-else class="w-full h-full rounded-lg border border-dashed border-[#333333] flex items-center justify-center">
              <span class="text-[10px] text-[#333333]">+</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button Footer -->
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-[#0E0E0E] border-t border-[#333333] z-20">
      <button
        @click="saveAllChanges"
        :disabled="isSaving || Object.keys(localUpdates).length === 0"
        class="w-full py-3 rounded-xl bg-[#C7A64F] text-black font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span v-if="isSaving">Guardando...</span>
        <span v-else>Guardar Cambios ({{ Object.keys(localUpdates).length }})</span>
      </button>
    </div>

    <!-- Touch Drag Ghost Element -->
    <div
      v-if="touchDragItem"
      class="fixed pointer-events-none z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl border-2 border-white"
      :class="touchDragItem.colorClass"
      :style="{ left: touchX + 'px', top: touchY + 'px', transform: 'translate(-50%, -50%)' }"
    >
      <span class="text-xs font-bold text-white">{{ touchDragItem.code }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ArrowLeft } from 'lucide-vue-next';
import { useAuth } from '@/stores/auth';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { GET_USER_CALENDAR_RANGE, UPDATE_DAILY_PLAN } from '@/graphql/calendar';

const auth = useAuth();
const userId = computed(() => auth.user?.id);

const weekdays = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];
const dayTypes = [
  { name: 'Día A', code: 'A', colorClass: 'bg-[#3B82F6]' },
  { name: 'Día B', code: 'B', colorClass: 'bg-[#EF4444]' },
  { name: 'Día C', code: 'C', colorClass: 'bg-[#10B981]' },
  { name: 'Día D', code: 'D', colorClass: 'bg-[#FBBF24]' },
  { name: 'Descanso', code: 'REST', colorClass: 'bg-[#6B7280]' },
];

const getDayTypeColor = (code) => {
  const type = dayTypes.find(t => t.code === code);
  return type ? type.colorClass : 'bg-[#5A5A5A]';
};

// Calendar Data
const startDate = '2025-12-01';
const endDate = '2026-01-11';

// Only query if we have a user ID
const { result, loading, refetch } = useQuery(GET_USER_CALENDAR_RANGE, () => ({
  userId: userId.value,
  startDate,
  endDate
}), {
  enabled: !!userId.value
});

// Local state for optimistic updates
const localUpdates = ref({});

const calendarDays = computed(() => {
  if (!userId.value) {
    return []; // Or handle unauth state
  }
  if (loading.value || !result.value?.getUserCalendarRange) {
    return generatePlaceholderDays();
  }

  const apiDays = result.value.getUserCalendarRange;

  return apiDays.map(d => ({
    day: new Date(d.date).getDate(),
    date: d.date,
    isCurrentMonth: new Date(d.date).getMonth() === 11, // Dec
    dayType: localUpdates.value[d.date] || d.dayType, // Use local update if exists
    isToday: d.isToday,
  }));
});

const generatePlaceholderDays = () => {
  const days = [];
  for (let i = 1; i <= 42; i++) {
     days.push({ day: i, date: `placeholder-${i}`, isCurrentMonth: true });
  }
  return days;
};

// --- Drag and Drop Logic (Desktop) ---
const isDragOver = ref(null);

const onDragStart = (event, type) => {
  event.dataTransfer.effectAllowed = 'copy';
  event.dataTransfer.setData('dayType', type.code);
};

const onDrop = (event, day) => {
  isDragOver.value = null;
  const typeCode = event.dataTransfer.getData('dayType');
  applyUpdate(day.date, typeCode);
};

// --- Touch Logic (Mobile) ---
const touchDragItem = ref(null);
const touchX = ref(0);
const touchY = ref(0);
const calendarGrid = ref(null);

const onTouchStart = (event, type) => {
  touchDragItem.value = type;
  const touch = event.touches[0];
  touchX.value = touch.clientX;
  touchY.value = touch.clientY;

  // Add global listeners
  document.addEventListener('touchmove', onTouchMove, { passive: false });
  document.addEventListener('touchend', onTouchEnd);
};

const onTouchMove = (event) => {
  event.preventDefault(); // Prevent scrolling while dragging
  const touch = event.touches[0];
  touchX.value = touch.clientX;
  touchY.value = touch.clientY;

  // Find element under finger
  const element = document.elementFromPoint(touch.clientX, touch.clientY);
  const dayCell = element?.closest('.day-cell');

  if (dayCell) {
    const date = dayCell.getAttribute('data-date');
    isDragOver.value = date;
  } else {
    isDragOver.value = null;
  }
};

const onTouchEnd = (event) => {
  const touch = event.changedTouches[0];
  const element = document.elementFromPoint(touch.clientX, touch.clientY);
  const dayCell = element?.closest('.day-cell');

  if (dayCell && touchDragItem.value) {
    const date = dayCell.getAttribute('data-date');
    applyUpdate(date, touchDragItem.value.code);
  }

  // Reset
  touchDragItem.value = null;
  isDragOver.value = null;
  document.removeEventListener('touchmove', onTouchMove);
  document.removeEventListener('touchend', onTouchEnd);
};

// --- Update Logic ---
const applyUpdate = (date, typeCode) => {
  if (typeCode && date && !date.startsWith('placeholder')) {
    localUpdates.value = {
      ...localUpdates.value,
      [date]: typeCode
    };
  }
};

// --- Saving ---
const { mutate: updatePlan } = useMutation(UPDATE_DAILY_PLAN);
const isSaving = ref(false);

const saveAllChanges = async () => {
  if (!userId.value) return;
  isSaving.value = true;

  const updates = Object.entries(localUpdates.value);

  try {
    // Process sequentially for now (or Promise.all)
    // Ideally backend supports bulk update
    await Promise.all(updates.map(([date, typeCode]) =>
      updatePlan({
        userId: userId.value,
        date: date,
        input: { dayTypeId: typeCode }
      })
    ));

    // Clear local updates after success
    localUpdates.value = {};
    refetch();
  } catch (e) {
    console.error('Error saving changes:', e);
    alert('Hubo un error al guardar los cambios.');
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
