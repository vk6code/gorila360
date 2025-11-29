<template>
  <div class="flex flex-col min-h-screen bg-[#0E0E0E] pb-20">
    <!-- Top Bar -->
    <div class="px-4 pt-6 pb-4">
        <div class="flex items-center justify-between mb-4">
          <button @click="$router.push({ name: 'student-calendar' })" class="w-9 h-9 rounded-full bg-[#141414] border border-[#333333] flex items-center justify-center">
            <ArrowLeft class="w-4 h-4 text-[#FFFFFF]" />
          </button>
          <div class="flex-1 text-center">
            <div class="text-sm font-medium text-[#FFFFFF] mb-1 capitalize">{{ formattedDate }}</div>
            <div class="inline-flex items-center gap-2 bg-[#3B82F6] rounded-full px-3 py-1" :class="dayTypeColorClass">
              <span class="text-xs font-bold text-[#FFFFFF] uppercase tracking-wide">{{ dayData.dayType }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button @click="navigate(-1)" class="w-9 h-9 rounded-full bg-[#141414] border border-[#333333] flex items-center justify-center">
              <ChevronLeft class="w-4 h-4 text-[#FFFFFF]" />
            </button>
            <button @click="navigate(1)" class="w-9 h-9 rounded-full bg-[#141414] border border-[#333333] flex items-center justify-center">
              <ChevronRight class="w-4 h-4 text-[#FFFFFF]" />
            </button>
          </div>
        </div>
        <div class="flex justify-end">
          <button @click="toggleEdit" class="flex items-center gap-2 text-[#C7A64F] text-xs">
            <Edit2 class="w-3.5 h-3.5" />
            <span>{{ isEditing ? 'Cancelar' : 'Editar día' }}</span>
          </button>
        </div>
      </div>

      <!-- Edit Mode -->
      <div v-if="isEditing" class="flex-1 px-4 pb-4">
        <div class="bg-[#141414] border border-[#333333] rounded-3xl p-6 space-y-6">
          <h3 class="text-lg font-semibold text-white mb-4">Editar Registro</h3>

          <!-- Day Type Selector -->
          <div>
            <label class="block text-xs uppercase text-[#5A5A5A] mb-2">Tipo de Día</label>
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="type in dayTypes"
                :key="type"
                @click="editDayType = type"
                :class="[
                  'p-2 rounded-lg text-xs font-bold border transition-all',
                  editDayType === type ? 'bg-[#C7A64F] text-black border-[#C7A64F]' : 'bg-[#0E0E0E] text-white border-[#333333]'
                ]"
              >
                {{ type }}
              </button>
            </div>
          </div>

          <!-- Steps Input -->
          <div>
            <label class="block text-xs uppercase text-[#5A5A5A] mb-2">Pasos Realizados</label>
            <div class="flex items-center gap-3">
               <input
                v-model.number="editSteps"
                type="number"
                class="flex-1 bg-[#0E0E0E] border border-[#333333] rounded-xl p-3 text-white focus:border-[#C7A64F] outline-none"
              />
              <span class="text-xs text-[#5A5A5A]">Meta: {{ stepsTarget }}</span>
            </div>
          </div>



          <button
            @click="saveChanges"
            :disabled="saving"
            class="w-full bg-[#C7A64F] hover:bg-[#B89542] text-[#000000] rounded-2xl py-4 font-semibold shadow-[0_0_20px_rgba(199,166,79,0.4)] transition-all flex items-center justify-center gap-2"
          >
            <span v-if="saving">Guardando...</span>
            <span v-else>Guardar Cambios</span>
          </button>
        </div>
      </div>

      <!-- View Mode -->
      <div v-else class="flex-1 px-4 pb-4">
        <div class="bg-[#141414] border border-[#333333] rounded-3xl p-6 space-y-6">

          <!-- Completion Status -->
          <div class="flex items-center justify-center mb-4">
             <div :class="['px-4 py-2 rounded-full border flex items-center gap-2', completionStatus.class]">
               <component :is="completionStatus.icon" class="w-4 h-4" />
               <span class="text-xs font-bold uppercase">{{ completionStatus.label }}</span>
             </div>
          </div>

          <!-- Key Metrics -->
          <div class="flex items-center justify-center gap-8">
            <!-- Calories -->
            <div class="flex flex-col items-center">
              <div class="relative w-24 h-24 mb-3">
                <svg class="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#333333" stroke-width="8" fill="none" />
                  <circle
                    cx="48" cy="48" r="40"
                    :stroke="caloriesColor"
                    stroke-width="8"
                    fill="none"
                    :stroke-dasharray="251.2"
                    :stroke-dashoffset="251.2 - (251.2 * caloriesPercentage / 100)"
                    stroke-linecap="round"
                  />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <Flame class="w-6 h-6 mb-1" :class="caloriesColorText" />
                </div>
              </div>
              <div class="text-2xl font-bold" :class="caloriesColorText">{{ dayData.caloriesDone || 0 }}</div>
              <div class="text-xs text-[#5A5A5A] uppercase tracking-widest">/ {{ dayData.calories }} kcal</div>
            </div>

            <!-- Steps -->
            <div class="flex flex-col items-center">
              <div class="relative w-24 h-24 mb-3">
                <svg class="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#333333" stroke-width="8" fill="none" />
                  <circle
                    cx="48" cy="48" r="40"
                    :stroke="stepsColor"
                    stroke-width="8"
                    fill="none"
                    :stroke-dasharray="251.2"
                    :stroke-dashoffset="251.2 - (251.2 * stepsPercentage / 100)"
                    stroke-linecap="round"
                  />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <Footprints class="w-6 h-6 mb-1" :class="stepsColorText" />
                </div>
              </div>
              <div class="text-2xl font-bold" :class="stepsColorText">{{ dayData.stepsDone || 0 }}</div>
              <div class="text-xs text-[#5A5A5A] uppercase tracking-widest">/ {{ stepsTarget }} pasos</div>
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t border-[#333333]"></div>

          <!-- Workout Section -->
          <div>
            <h3 class="text-xs uppercase tracking-widest text-[#5A5A5A] mb-3">ENTRENAMIENTO</h3>
            <div class="bg-[#0E0E0E] rounded-2xl p-4 mb-4">
              <div class="text-lg font-semibold text-[#FFFFFF] mb-1">{{ dayData.workoutName }}</div>
              <div class="text-sm text-[#5A5A5A]">{{ dayData.focus }}</div>
            </div>
            <button class="w-full bg-[#C7A64F] hover:bg-[#B89542] text-[#000000] rounded-2xl py-4 font-semibold shadow-[0_0_20px_rgba(199,166,79,0.4)] transition-all flex items-center justify-center gap-2">
              <Play class="w-5 h-5" fill="currentColor" />
              Iniciar entrenamiento
            </button>
          </div>

          <!-- Divider -->
          <div class="border-t border-[#333333]"></div>

          <!-- Diet Section -->
          <div>
            <h3 class="text-xs uppercase tracking-widest text-[#5A5A5A] mb-3">DIETA</h3>
            <button class="w-full bg-[#0E0E0E] border border-[#333333] hover:border-[#C7A64F] rounded-2xl p-4 flex items-center justify-center gap-2 transition-all">
              <Utensils class="w-5 h-5 text-[#C7A64F]" />
              <span class="text-sm text-[#FFFFFF]">Abre tu dieta para hoy</span>
            </button>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Flame,
  Footprints,
  Play,
  Utensils,
  CheckCircle,
  AlertCircle,
  XCircle,
  Activity
} from 'lucide-vue-next';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { GET_USER_DAY_DETAIL, UPDATE_DAILY_PLAN } from '@/graphql/calendar';

const auth = useAuth();
const route = useRoute();
const router = useRouter();

console.log('StudentCalendarDay mounted. Auth User:', auth.user.value);
console.log('Route Params:', route.params);

const currentDate = computed(() => {
  return route.params.date ? new Date(route.params.date) : new Date();
});

const formattedDate = computed(() => {
  return currentDate.value.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});

const dateParam = computed(() => currentDate.value.toISOString().split('T')[0]);
// Fallback to ID 1 (Victor) if no auth user found (for guest/mock mode)
const userId = computed(() => auth.user?.id || 1);

// Query
const { result, loading, error, refetch } = useQuery(GET_USER_DAY_DETAIL, () => ({
  userId: userId.value,
  date: dateParam.value
}));

const dayData = computed(() => {
  if (loading.value || error.value || !result.value?.getUserDayDetail) {
    return {
      dayType: '...',
      calories: 0,
      steps: 0,
      caloriesDone: 0,
      stepsDone: 0,
      workoutName: '...',
      focus: '...'
    };
  }
  return result.value.getUserDayDetail;
});

// Dynamic Step Targets
const stepsTarget = computed(() => {
  // 20k for REST, 15k for others (Training)
  if (dayData.value.dayType === 'REST') {
    return 20000;
  }
  return 15000;
});

// Edit State
const isEditing = ref(false);
const editSteps = ref(0);
const editDayType = ref('A');
const dayTypes = ['A', 'B', 'C', 'D', 'REST'];

// Sync edit state with data
watch(dayData, (newVal) => {
  if (newVal) {
    editSteps.value = newVal.stepsDone || 0;
    editDayType.value = newVal.dayType || 'A';
  }
}, { immediate: true });

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

// Mutation
const { mutate: updatePlan, loading: saving } = useMutation(UPDATE_DAILY_PLAN);

const saveChanges = async () => {
  try {
    await updatePlan({
      userId: userId.value,
      date: dateParam.value,
      input: {
        dayTypeId: editDayType.value,
        stepsDone: editSteps.value,
        // caloriesDone is not updated here, it comes from diet logs
      }
    });
    isEditing.value = false;
    refetch();
  } catch (e) {
    console.error('Error saving changes:', e);
  }
};

const navigate = (days) => {
  const newDate = new Date(currentDate.value);
  newDate.setDate(newDate.getDate() + days);
  const dateString = newDate.toISOString().split('T')[0];
  router.push({ name: 'calendar-day', params: { date: dateString } });
};

// Visual Logic
const caloriesPercentage = computed(() => {
  if (!dayData.value.calories) return 0;
  return Math.min(100, (dayData.value.caloriesDone / dayData.value.calories) * 100);
});

const stepsPercentage = computed(() => {
  if (!stepsTarget.value) return 0;
  return Math.min(100, (dayData.value.stepsDone / stepsTarget.value) * 100);
});

const caloriesColor = computed(() => caloriesPercentage.value >= 100 ? '#10B981' : '#C7A64F');
const caloriesColorText = computed(() => caloriesPercentage.value >= 100 ? 'text-[#10B981]' : 'text-[#C7A64F]');

const stepsColor = computed(() => stepsPercentage.value >= 100 ? '#10B981' : '#C7A64F');
const stepsColorText = computed(() => stepsPercentage.value >= 100 ? 'text-[#10B981]' : 'text-[#C7A64F]');

const completionStatus = computed(() => {
  const stepsOk = stepsPercentage.value >= 100;
  const dietOk = caloriesPercentage.value >= 100;
  const stepsLow = (dayData.value.stepsDone || 0) < 5000;

  if (stepsOk && dietOk) {
    return { label: 'Completado', class: 'bg-[#10B981]/10 border-[#10B981] text-[#10B981]', icon: CheckCircle };
  }
  if (stepsOk) {
    return { label: 'Pasos Completados', class: 'bg-[#F59E0B]/10 border-[#F59E0B] text-[#F59E0B]', icon: AlertCircle };
  }
  if (dietOk) {
    return { label: 'Dieta Completada', class: 'bg-[#FBBF24]/10 border-[#FBBF24] text-[#FBBF24]', icon: AlertCircle };
  }
  if (stepsLow) {
    return { label: 'Incompleto', class: 'bg-[#EF4444]/10 border-[#EF4444] text-[#EF4444]', icon: XCircle };
  }
  return { label: 'En Progreso', class: 'bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6]', icon: Activity };
});

const dayTypeColorClass = computed(() => {
  const colors = {
    'A': 'bg-[#3B82F6]',
    'B': 'bg-[#EF4444]',
    'C': 'bg-[#10B981]',
    'D': 'bg-[#FBBF24]',
    'REST': 'bg-[#6B7280]'
  };
  return colors[dayData.value.dayType] || 'bg-[#3B82F6]';
});
</script>
