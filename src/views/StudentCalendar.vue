<template>
  <div class="flex flex-col min-h-screen bg-[#0E0E0E] pb-20">
    <!-- Header -->
    <div class="px-4 pt-6 pb-3">
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
            @click="$router.push({ name: 'calendar-week' })"
            class="flex-1 px-4 py-2 rounded-full text-xs font-medium text-[#5A5A5A] transition-all"
          >
            Semana
          </button>
          <button
            class="flex-1 px-4 py-2 rounded-full text-xs font-medium bg-[#C7A64F] text-[#000000] shadow-[0_0_15px_rgba(199,166,79,0.4)]"
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
            <span class="text-[10px] text-[#C7A64F] font-medium">Tipos</span>
          </button>
        </div>
      </div>
      <!-- Month Title -->
      <h2 class="text-center text-xl font-semibold text-[#FFFFFF] mb-3">
        Diciembre 2025
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
      <div v-if="showLegend" class="px-4 mb-3">
        <div class="bg-[#141414] border border-[#333333] rounded-2xl p-3">
          <div class="space-y-2">
            <div v-for="dayType in dayTypes" :key="dayType.name" class="flex items-center gap-2">
              <div :class="['w-2.5 h-2.5 rounded-full', dayType.colorClass]"></div>
              <div class="flex-1">
                <div class="text-xs font-semibold text-[#FFFFFF]">{{ dayType.name }}</div>
                <div class="text-[10px] text-[#5A5A5A]">{{ dayType.calories }} kcal / {{ dayType.steps }} pasos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- Calendar Grid -->
    <div class="flex-1 px-4 pb-4">
      <div class="grid grid-cols-7 gap-1.5 h-full">
        <!-- Weekday Headers -->
        <div v-for="day in weekdays" :key="day" class="text-center text-[9px] uppercase tracking-[0.12em] text-[#5A5A5A] font-medium pb-1.5">
          {{ day }}
        </div>
        <!-- Day Cards - Compact Boxes -->
        <div
          v-for="day in calendarDays"
          :key="day.date"
          @click="navigateToDay(day.date)"
          :class="[
            'rounded-xl bg-[#141414] border border-[#333333] p-1.5 flex flex-col justify-between cursor-pointer transition-all hover:border-[#C7A64F] aspect-square',
            !day.isCurrentMonth && 'opacity-30',
            day.isToday && 'border-[#C7A64F] bg-[#C7A64F]/10'
          ]"
        >
          <div class="text-xs font-semibold text-[#FFFFFF] text-center">{{ day.day }}</div>
          <div class="flex items-center justify-center flex-1 py-1">
            <div
              v-if="day.dayType"
              class="w-0.5 h-6 rounded-full"
              :style="{ backgroundColor: day.color || '#5A5A5A' }"
            ></div>
          </div>
          <div class="flex items-center justify-center">
            <component
              v-if="day.workoutIcon"
              :is="day.workoutIcon"
              class="w-3 h-3 text-[#C7A64F]"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- Floating Add Button -->
    <!-- Next Month Button -->
    <div class="px-4 mt-4">
      <button class="w-full py-3 rounded-xl bg-[#141414] border border-[#333333] text-[#5A5A5A] text-xs font-bold uppercase tracking-wider hover:text-white hover:border-[#C7A64F] transition-all">
        Ver Siguiente Mes
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Edit2, Info } from 'lucide-vue-next';
import { Dumbbell, Activity, ListChecks, Sparkles } from 'lucide-vue-next';
const router = useRouter();
const showLegend = ref(false);
const weekdays = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];
const dayTypes = [
  { name: 'DAY A', colorClass: 'bg-[#3B82F6]', calories: '3000', steps: '1,000' },
  { name: 'DAY B', colorClass: 'bg-[#EF4444]', calories: '3000', steps: '2,000' },
  { name: 'DAY C', colorClass: 'bg-[#10B981]', calories: '2000', steps: '1,000' },
  { name: 'DAY D', colorClass: 'bg-[#FBBF24]', calories: '4000', steps: '10,000' },
];
const workoutIcons = {
  chest: Dumbbell,
  back: Activity,
  legs: ListChecks,
  fullbody: Sparkles,
};
import { computed } from 'vue';
import { useAuth } from '@/stores/auth';
import { useQuery } from '@vue/apollo-composable';
import { GET_USER_CALENDAR_RANGE } from '@/graphql/calendar';

const auth = useAuth();
const userId = computed(() => auth.user?.id || 1);

// Calculate date range for Dec 2025 (Fixed for demo as per template)
// Start: Dec 1, 2025 (Monday) - No padding needed at start
// End: Jan 11, 2026 (To fill 42 days grid)
const startDate = '2025-12-01';
const endDate = '2026-01-11'; // 6 weeks covers enough

const { result, loading } = useQuery(GET_USER_CALENDAR_RANGE, () => ({
  userId: userId.value,
  startDate,
  endDate
}));

const calendarDays = computed(() => {
  if (loading.value || !result.value?.getUserCalendarRange) {
    // Return empty grid or loading state
    return generatePlaceholderDays();
  }

  const apiDays = result.value.getUserCalendarRange;
  // Map API data to view model
  // We need to ensure we fill the grid.
  // If API returns exact range, we just map it.

  return apiDays.map(d => ({
    day: new Date(d.date).getDate(),
    date: d.date,
    isCurrentMonth: new Date(d.date).getMonth() === 11, // Dec
    dayType: d.dayType,
    workoutIcon: d.workoutIcon ? workoutIcons[d.workoutIcon] : null,
    isToday: d.isToday,
    color: d.dayTypeColor
  }));
});

const generatePlaceholderDays = () => {
   // Keep the old generation for loading state / fallback
  const days = [];

  // ... simplified placeholder generation
  for (let i = 1; i <= 42; i++) {
     days.push({ day: i, date: '', isCurrentMonth: true });
  }
  return days;
};
const navigateToDay = (date) => {
  router.push(`/day/${date}`);
};
</script>
