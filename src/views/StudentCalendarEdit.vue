<template>
  <div class="flex flex-col min-h-screen bg-[#0E0E0E] pb-40">
    <!-- Top Bar: Actions -->
    <div class="px-4 pt-6 pb-3 sticky top-0 bg-[#0E0E0E] z-30 border-b border-[#333333] flex items-center justify-between">
      <button @click="$router.push({ name: 'student-calendar' })" class="flex items-center gap-2 text-[#C7A64F] font-bold text-sm uppercase tracking-wider">
        <ArrowLeft class="w-4 h-4" />
        <span>Terminar</span>
      </button>

      <button
        @click="saveAllChanges"
        :disabled="isSaving || Object.keys(localUpdates).length === 0"
        class="px-6 py-2 rounded-full bg-[#C7A64F] text-black font-bold text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <span v-if="isSaving">...</span>
        <span v-else>Guardar ({{ Object.keys(localUpdates).length }})</span>
      </button>
    </div>

    <!-- Month Navigation (Placeholder for full 2025-2026 support) -->
    <div class="px-4 py-2 flex items-center justify-center gap-4">
       <span class="text-white font-bold uppercase">Diciembre 2025</span>
    </div>

    <!-- Calendar Grid -->
    <div class="flex-1 px-4 py-2 relative" ref="calendarGrid">
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
          @click="onDayClick(day)"
          @dragover.prevent
          @drop="onDrop($event, day)"
          :class="[
            'day-cell rounded-xl bg-[#141414] border border-[#333333] p-1.5 flex flex-col justify-between transition-all aspect-square relative',
            !day.isCurrentMonth && 'opacity-30',
            day.isToday && 'border-[#C7A64F] bg-[#C7A64F]/10',
            isDragOver === day.date && 'border-[#C7A64F] bg-[#C7A64F]/20 scale-105 z-10',
            !day.isEditable && 'opacity-50 cursor-not-allowed'
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
            <div v-else-if="day.isEditable" class="w-full h-full rounded-lg border border-dashed border-[#333333] flex items-center justify-center">
              <span class="text-[10px] text-[#333333]">+</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Palette (Fixed) -->
    <div class="fixed bottom-0 left-0 right-0 bg-[#141414] border-t border-[#333333] z-40 pb-8 pt-4 px-4 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
      <div class="text-xs text-[#5A5A5A] text-center mb-3 uppercase tracking-wider font-medium">Arrastra o selecciona un tipo de día</div>

      <div class="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <div
          v-for="type in userDayTypes"
          :key="type.code"
          draggable="true"
          @dragstart="onDragStart($event, type)"
          @touchstart.passive="onTouchStart($event, type)"
          class="flex flex-col items-center gap-1 min-w-[60px] cursor-move active:scale-95 transition-transform select-none"
        >
          <div :class="['w-12 h-12 rounded-full flex items-center justify-center shadow-lg border border-[#333333]', type.colorClass]">
            <span class="text-sm font-bold text-white">{{ type.code }}</span>
          </div>
          <span class="text-[9px] font-bold text-[#FFFFFF] uppercase">{{ type.name }}</span>
        </div>
      </div>
    </div>

    <!-- Selection Modal -->
    <div v-if="showSelectionModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" @click.self="closeModal">
      <div class="bg-[#141414] border border-[#333333] rounded-2xl w-full max-w-xs p-6 space-y-4">
        <h3 class="text-lg font-bold text-white text-center">Seleccionar Día</h3>
        <p class="text-xs text-[#5A5A5A] text-center uppercase tracking-wider mb-4">{{ selectedDay?.date }}</p>

        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="type in userDayTypes"
            :key="type.code"
            @click="selectTypeForDay(type)"
            class="flex flex-col items-center p-3 rounded-xl border border-[#333333] hover:border-[#C7A64F] transition-all bg-[#0E0E0E]"
          >
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center mb-2', type.colorClass]">
              <span class="text-xs font-bold text-white">{{ type.code }}</span>
            </div>
            <span class="text-[10px] font-medium text-white">{{ type.name }}</span>
          </button>
        </div>

        <button @click="closeModal" class="w-full py-3 rounded-xl bg-[#222] text-white text-xs font-bold uppercase tracking-wider mt-2">
          Cancelar
        </button>
      </div>
    </div>

    <!-- Touch Drag Ghost Element -->
    <div
      v-if="touchDragItem"
      class="fixed pointer-events-none z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border-2 border-white"
      :class="touchDragItem.colorClass"
      :style="{ left: touchX + 'px', top: touchY + 'px', transform: 'translate(-50%, -50%)' }"
    >
      <span class="text-sm font-bold text-white">{{ touchDragItem.code }}</span>
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
console.log('StudentCalendarEdit mounted. Auth User:', auth.user.value);
// Fallback to ID 1 (Victor) if no auth user found (for guest/mock mode)
const userId = computed(() => auth.user?.id || 1);

const weekdays = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];

// --- 1. Dynamic Day Types (Mocked for now, should be a Query) ---
// In a real scenario, useQuery(GET_USER_DAY_TYPES, { userId })
const userDayTypes = ref([
  { name: 'Pierna', code: 'A', colorClass: 'bg-[#3B82F6]' }, // Blue
  { name: 'Empuje', code: 'B', colorClass: 'bg-[#EF4444]' }, // Red
  { name: 'Tracción', code: 'C', colorClass: 'bg-[#10B981]' }, // Green
  { name: 'Full Body', code: 'D', colorClass: 'bg-[#FBBF24]' }, // Yellow
  { name: 'Descanso', code: 'REST', colorClass: 'bg-[#6B7280]' }, // Gray
]);

const getDayTypeColor = (code) => {
  const type = userDayTypes.value.find(t => t.code === code);
  return type ? type.colorClass : 'bg-[#5A5A5A]';
};

// --- 2. Calendar Data & Date Restrictions ---
const startDate = '2025-12-01';
const endDate = '2026-01-11';

// Only query if we have a user ID
const { result, loading, refetch } = useQuery(GET_USER_CALENDAR_RANGE, () => ({
  userId: userId.value,
  startDate,
  endDate
}));

// Local state for optimistic updates
const localUpdates = ref({});

// Date Helpers
const today = new Date();
today.setHours(0, 0, 0, 0);
const maxEditDate = new Date(today);
maxEditDate.setDate(today.getDate() + 15);

const isDateEditable = (dateString) => {
  const d = new Date(dateString);
  d.setHours(0, 0, 0, 0);
  // Editable if: date >= today AND date <= today + 15
  return d >= today && d <= maxEditDate;
};

const calendarDays = computed(() => {
  if (loading.value || !result.value?.getUserCalendarRange) {
    return generatePlaceholderDays();
  }

  const apiDays = result.value.getUserCalendarRange;

  return apiDays.map(d => ({
    day: new Date(d.date).getDate(),
    date: d.date,
    isCurrentMonth: new Date(d.date).getMonth() === 11, // Dec 2025
    dayType: localUpdates.value[d.date] || d.dayType,
    isToday: d.isToday,
    isEditable: isDateEditable(d.date)
  }));
});

const generatePlaceholderDays = () => {
  const days = [];
  for (let i = 1; i <= 42; i++) {
     days.push({ day: i, date: `placeholder-${i}`, isCurrentMonth: true, isEditable: false });
  }
  return days;
};

// --- 3. Interaction Logic (Click Modal) ---
const showSelectionModal = ref(false);
const selectedDay = ref(null);

const onDayClick = (day) => {
  if (!day.isEditable) return;
  selectedDay.value = day;
  showSelectionModal.value = true;
};

const closeModal = () => {
  showSelectionModal.value = false;
  selectedDay.value = null;
};

const selectTypeForDay = (type) => {
  if (selectedDay.value) {
    applyUpdate(selectedDay.value.date, type.code);
    closeModal();
  }
};

// --- 4. Drag and Drop Logic (Desktop) ---
const isDragOver = ref(null);

const onDragStart = (event, type) => {
  event.dataTransfer.effectAllowed = 'copy';
  event.dataTransfer.setData('dayType', type.code);
};

const onDrop = (event, day) => {
  if (!day.isEditable) return;
  isDragOver.value = null;
  const typeCode = event.dataTransfer.getData('dayType');
  applyUpdate(day.date, typeCode);
};

// --- 5. Touch Logic (Mobile) ---
const touchDragItem = ref(null);
const touchX = ref(0);
const touchY = ref(0);

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
    // Check editability
    if (isDateEditable(date)) {
        isDragOver.value = date;
    } else {
        isDragOver.value = null;
    }
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
    if (isDateEditable(date)) {
        applyUpdate(date, touchDragItem.value.code);
    }
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
