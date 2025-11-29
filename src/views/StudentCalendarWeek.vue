<template>
  <div class="flex flex-col min-h-screen bg-[#0E0E0E] pb-20">
    <!-- Header -->
    <div class="px-4 pt-6 pb-4">
      <h1 class="text-center text-sm font-bold uppercase tracking-tight text-[#FFFFFF] mb-4">
        CALENDARIO
      </h1>
      <!-- Segmented Control + Actions -->
      <div class="flex items-center justify-between gap-3 mb-3">
        <div class="flex bg-[#141414] rounded-full p-1 flex-1 max-w-xs mx-auto">
          <button
            @click="$router.push({ name: 'calendar-day' })"
            class="flex-1 px-4 py-2 rounded-full text-xs font-medium text-[#5A5A5A] transition-all"
          >
            Día
          </button>
          <button
            class="flex-1 px-4 py-2 rounded-full text-xs font-medium bg-[#C7A64F] text-[#000000] shadow-[0_0_15px_rgba(199,166,79,0.4)]"
          >
            Semana
          </button>
          <button
            @click="$router.push({ name: 'student-calendar' })"
            class="flex-1 px-4 py-2 rounded-full text-xs font-medium text-[#5A5A5A] transition-all"
          >
            Mes
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button @click="$router.push({ name: 'calendar-edit' })" class="w-8 h-8 rounded-full bg-[#141414] border border-[#333333] flex items-center justify-center">
            <Edit2 class="w-4 h-4 text-[#C7A64F]" />
          </button>
          <button
            @click="showLegend = !showLegend"
            class="px-3 h-8 rounded-full bg-[#141414] border border-[#C7A64F] flex items-center gap-1.5"
          >
            <Info class="w-3.5 h-3.5 text-[#C7A64F]" />
          </button>
        </div>
      </div>
      <h2 class="text-center text-base font-medium text-[#FFFFFF] mb-4">
        Planificador Semanal
      </h2>
    </div>
    <!-- Legend Modal -->
    <transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div v-if="showLegend" class="px-4 mb-4">
        <div class="bg-[#141414] border border-[#333333] rounded-2xl p-4">
          <div class="space-y-3">
            <div v-for="dayType in dayTypes" :key="dayType.name" class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: dayType.color }"></div>
              <div class="flex-1">
                <div class="text-sm font-semibold text-[#FFFFFF]">{{ dayType.name }}</div>
                <div class="text-xs text-[#5A5A5A]">{{ dayType.calories }} kcal / {{ dayType.steps }} pasos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- Week Cards - Horizontal Scroll -->
    <div class="flex-1 px-4 pb-4 flex items-center">
      <div class="flex gap-3 overflow-x-auto pb-4 w-full">
        <div
          v-for="day in weekDays"
          :key="day.date"
          @click="$router.push({ name: 'calendar-day', params: { date: day.date } })"
          class="flex-shrink-0 w-44 bg-[#141414] border border-[#333333] rounded-3xl p-5 flex flex-col gap-4 cursor-pointer hover:border-[#C7A64F] transition-all"
        >
          <!-- Day Header -->
          <div class="text-center space-y-1">
            <div class="text-[9px] uppercase tracking-[0.15em] text-[#5A5A5A] font-medium">{{ day.weekday }}</div>
            <div class="text-xl font-semibold text-[#FFFFFF]">{{ day.day }}</div>
          </div>
          <!-- Day Type Pill -->
          <div class="rounded-full py-2 px-4 text-center" :style="{ backgroundColor: day.color }">
            <span class="text-[11px] font-bold text-[#FFFFFF] uppercase tracking-wide">{{ day.dayType }}</span>
          </div>
          <!-- Metrics -->
          <div class="space-y-2.5">
            <div class="flex items-center gap-2">
              <Flame class="w-4 h-4 text-[#C7A64F] flex-shrink-0" />
              <span class="text-xs text-[#FFFFFF] font-medium">{{ day.calories }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Footprints class="w-4 h-4 text-[#C7A64F] flex-shrink-0" />
              <span class="text-xs text-[#FFFFFF] font-medium">{{ day.steps }}</span>
            </div>
          </div>
          <!-- Focus Label -->
          <div class="mt-auto pt-3 border-t border-[#333333] text-center">
            <div class="text-sm font-semibold text-[#C7A64F]">
              {{ day.focus }}
            </div>
            <Dumbbell class="w-3.5 h-3.5 text-[#C7A64F] mx-auto mt-2" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { Info, Flame, Footprints, Edit2, Dumbbell } from 'lucide-vue-next';
const showLegend = ref(false);
const dayTypes = [
  { name: 'DAY A', color: '#3B82F6', calories: '3000', steps: '1,000' },
  { name: 'DAY B', color: '#EF4444', calories: '3000', steps: '2,000' },
  { name: 'DAY C', color: '#10B981', calories: '2000', steps: '1,000' },
  { name: 'DAY D', color: '#FBBF24', calories: '4000', steps: '10,000' },
];
import { computed } from 'vue';
import { useAuth } from '@/stores/auth';
import { useQuery } from '@vue/apollo-composable';
import { GET_USER_CALENDAR_RANGE } from '@/graphql/calendar';

const auth = useAuth();
const userId = computed(() => auth.user?.id || 1);

// Week Range: Current Week (Mon-Sun)
const getWeekRange = () => {
  const now = new Date();
  const day = now.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday

  const start = new Date(now.setDate(diff));
  const end = new Date(now.setDate(start.getDate() + 6));

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  };
};

const { start: startDate, end: endDate } = getWeekRange();

const { result } = useQuery(GET_USER_CALENDAR_RANGE, () => ({
  userId: userId.value,
  startDate,
  endDate
}));

const weekDays = computed(() => {
  const weekdaysMap = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
  const { start } = getWeekRange();
  const startDateObj = new Date(start);

  const days = [];
  const apiDays = result.value?.getUserCalendarRange || [];

  for (let i = 0; i < 7; i++) {
    const current = new Date(startDateObj);
    current.setDate(startDateObj.getDate() + i);
    const dateString = current.toISOString().split('T')[0];

    // Find API data for this day
    const d = apiDays.find(apiDay => apiDay.date === dateString) || {};

    // Handle dayType object or string safely
    const typeCode = d.dayType?.code || d.dayType || 'REST';
    const typeName = typeCode !== 'REST' ? `DAY ${typeCode}` : 'DESCANSO';
    const typeInfo = dayTypes.find(t => t.name === typeName) || { calories: 0, steps: 0, name: typeName };

    days.push({
      weekday: weekdaysMap[current.getDay()],
      day: current.getDate(),
      date: dateString,
      dayType: typeName,
      color: d.dayTypeColor || typeInfo.color || '#333333',
      calories: `${typeInfo.calories || 0} kcal`,
      steps: `${typeInfo.steps || 0} pasos`,
      focus: getFocusForType(typeCode),
    });
  }
  return days;
});

const getFocusForType = (type) => {
  const map = {
    'A': 'Pecho',
    'B': 'Espalda',
    'C': 'Piernas',
    'D': 'Superior'
  };
  return map[type] || 'General';
};
</script>
