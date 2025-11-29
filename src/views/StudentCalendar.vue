<template>
  <div class="flex flex-col min-h-screen bg-[#0E0E0E] pb-20">
    <!-- Header -->
    <div class="px-4 pt-6 pb-3">
      <h1 class="text-center text-sm font-bold uppercase tracking-tight text-[#FFFFFF] mb-4">
        CALENDAR
      </h1>
      <!-- Segmented Control + Actions -->
      <div class="flex items-center justify-between gap-3 mb-3">
        <div class="flex bg-[#141414] rounded-full p-1 flex-1 max-w-xs mx-auto">
          <button
            @click="$router.push('/day')"
            class="flex-1 px-4 py-2 rounded-full text-xs font-medium text-[#5A5A5A] transition-all"
          >
            Day
          </button>
          <button
            @click="$router.push('/week')"
            class="flex-1 px-4 py-2 rounded-full text-xs font-medium text-[#5A5A5A] transition-all"
          >
            Week
          </button>
          <button
            class="flex-1 px-4 py-2 rounded-full text-xs font-medium bg-[#C7A64F] text-[#000000] shadow-[0_0_15px_rgba(199,166,79,0.4)]"
          >
            Month
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button class="w-8 h-8 rounded-full bg-[#141414] border border-[#333333] flex items-center justify-center">
            <Edit2 class="w-4 h-4 text-[#C7A64F]" />
          </button>
          <button
            @click="showLegend = !showLegend"
            class="px-3 h-8 rounded-full bg-[#141414] border border-[#C7A64F] flex items-center gap-1.5"
          >
            <Info class="w-3.5 h-3.5 text-[#C7A64F]" />
            <span class="text-[10px] text-[#C7A64F] font-medium">Types</span>
          </button>
        </div>
      </div>
      <!-- Month Title -->
      <h2 class="text-center text-xl font-semibold text-[#FFFFFF] mb-3">
        December 2025
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
                <div class="text-[10px] text-[#5A5A5A]">{{ dayType.calories }} kcal / {{ dayType.steps }} steps</div>
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
          ]"
        >
          <div class="text-xs font-semibold text-[#FFFFFF] text-center">{{ day.day }}</div>
          <div class="flex items-center justify-center flex-1 py-1">
            <div
              v-if="day.dayType"
              :class="['w-0.5 h-6 rounded-full', getDayTypeColor(day.dayType)]"
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
    <button class="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-[#C7A64F] shadow-[0_0_20px_rgba(199,166,79,0.5)] flex items-center justify-center">
      <Plus class="w-6 h-6 text-[#000000]" />
    </button>
    <!-- Bottom Navigation -->
    <div class="fixed bottom-0 left-0 right-0 bg-[#141414] border-t border-[#333333] px-6 py-4">
      <div class="flex items-center justify-around">
        <button class="flex flex-col items-center gap-1" @click="$router.push('/')">
          <Home class="w-5 h-5 text-[#5A5A5A]" />
          <span class="text-[10px] text-[#5A5A5A]">Home</span>
        </button>
        <button class="flex flex-col items-center gap-1">
          <Calendar class="w-5 h-5 text-[#C7A64F]" />
          <span class="text-[10px] text-[#C7A64F]">Calendar</span>
        </button>
        <button class="flex flex-col items-center gap-1">
          <User class="w-5 h-5 text-[#5A5A5A]" />
          <span class="text-[10px] text-[#5A5A5A]">Profile</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Calendar, Home, User, Plus, Edit2, Info } from 'lucide-vue-next';
import { Dumbbell, Activity, ListChecks, Sparkles } from 'lucide-vue-next';
const router = useRouter();
const showLegend = ref(false);
const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
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
const getDayTypeColor = (type) => {
  const colors = {
    'A': 'bg-[#3B82F6]',
    'B': 'bg-[#EF4444]',
    'C': 'bg-[#10B981]',
    'D': 'bg-[#FBBF24]',
  };
  return colors[type] || 'bg-[#5A5A5A]';
};
const generateCalendarDays = () => {
  const days = [];
  const firstDay = new Date(2025, 11, 1);
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  for (let i = 0; i < startDay; i++) {
    const prevDate = new Date(2025, 11, -startDay + i + 1);
    days.push({
      day: prevDate.getDate(),
      date: prevDate.toISOString().split('T')[0],
      isCurrentMonth: false,
      dayType: null,
      workoutIcon: null,
    });
  }
  for (let i = 1; i <= 31; i++) {
    const dayTypes = ['A', 'B', 'C', 'D'];
    const icons = Object.values(workoutIcons);
    days.push({
      day: i,
      date: `2025-12-${String(i).padStart(2, '0')}`,
      isCurrentMonth: true,
      dayType: dayTypes[Math.floor(Math.random() * dayTypes.length)],
      workoutIcon: icons[Math.floor(Math.random() * icons.length)],
    });
  }
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      date: `2026-01-${String(i).padStart(2, '0')}`,
      isCurrentMonth: false,
      dayType: null,
      workoutIcon: null,
    });
  }
  return days;
};
const calendarDays = ref(generateCalendarDays());
const navigateToDay = (date) => {
  router.push(`/day/${date}`);
};
</script>
