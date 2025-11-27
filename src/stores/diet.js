import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { dbService } from '@/services/db';
import { syncService } from '@/services/sync';
import { useAuth } from '@/stores/auth';

export const useDietStore = defineStore('diet', () => {
  const dietPlan = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const lastSyncTime = ref(null);

  const { user } = useAuth();
  const userId = computed(() => user.value?.sub || user.value?.id || "1");

  /**
   * Loads the diet plan from local storage.
   * This provides instant UI feedback (Offline First).
   */
  async function loadFromLocal() {
    if (!userId.value) return;

    try {
      const localPlan = await dbService.getDietPlan(userId.value);
      if (localPlan) {
        dietPlan.value = localPlan;
        console.log('[DietStore] Loaded from local DB');
      }
    } catch (err) {
      console.error('[DietStore] Error loading local plan:', err);
    }
  }

  /**
   * Syncs with the server and updates local storage.
   * Should be called in background.
   */
  async function sync() {
    if (!userId.value) return;

    loading.value = true;
    error.value = null;

    try {
      // Perform sync
      const syncedPlan = await syncService.syncDiet(userId.value);

      // Update state if we got new data
      if (syncedPlan) {
        dietPlan.value = syncedPlan;
        lastSyncTime.value = new Date();
      }
    } catch (err) {
      console.error('[DietStore] Sync failed:', err);
      error.value = err;
      // Note: We don't clear dietPlan.value here, so the user still sees stale data (Offline)
    } finally {
      loading.value = false;
    }
  }

  /**
   * Computed properties for the View (Macros logic)
   * Moved from DietView to Store for better separation
   */
  const allFoods = computed(() => {
    if (!dietPlan.value?.meals) return [];
    return dietPlan.value.meals.flatMap(meal => meal.foods);
  });

  const fatsPlanned = computed(() => {
    return allFoods.value
      .filter(item => item.food && item.food.fatsG > 5)
      .map(item => ({
        name: item.food.name,
        amount: `${item.amount} ${item.unit}`
      }));
  });

  const carbsPlanned = computed(() => {
    return allFoods.value
      .filter(item => item.food && item.food.carbsG > 10)
      .map(item => ({
        name: item.food.name,
        amount: `${item.amount} ${item.unit}`
      }));
  });

  const proteinsPlanned = computed(() => {
    return allFoods.value
      .filter(item => item.food && item.food.proteinsG > 5)
      .map(item => ({
        name: item.food.name,
        amount: `${item.amount} ${item.unit}`
      }));
  });

  return {
    dietPlan,
    loading,
    error,
    loadFromLocal,
    sync,
    fatsPlanned,
    carbsPlanned,
    proteinsPlanned,

    // New Computed Properties for Updated View
    fixedFoods: computed(() => {
      // TODO: Backend integration needed.
      // Currently mocking "Fixed" status based on specific food names or random assignment for demo.
      // In production, check for `item.isFixed` property from API.
      return allFoods.value
        .filter(item => item.food && (item.food.name.toLowerCase().includes('batido') || item.food.name.toLowerCase().includes('creatina') || Math.random() > 0.8))
        .map(item => ({
          name: item.food.name,
          amount: `${item.amount} ${item.unit}`,
          isFixed: true
        }));
    }),

    recipes: computed(() => {
      // TODO: Backend integration needed.
      // Mocking recipes list.
      return [
        { id: 1, name: 'Pollo al Curry con Arroz Basmati' },
        { id: 2, name: 'Tortilla de Claras con Avena' },
        { id: 3, name: 'Batido de Proteínas Post-Entreno' },
        { id: 4, name: 'Ensalada de Atún y Aguacate' }
      ];
    }),

    macrosDistribution: computed(() => {
      // Calculate total macros from planned foods
      // This is an approximation based on the lists
      const totalFats = allFoods.value.reduce((acc, item) => acc + (item.food?.fatsG || 0), 0);
      const totalCarbs = allFoods.value.reduce((acc, item) => acc + (item.food?.carbsG || 0), 0);
      const totalProteins = allFoods.value.reduce((acc, item) => acc + (item.food?.proteinsG || 0), 0);
      const total = totalFats + totalCarbs + totalProteins;

      return {
        fats: total ? Math.round((totalFats / total) * 100) : 30,
        carbs: total ? Math.round((totalCarbs / total) * 100) : 40,
        proteins: total ? Math.round((totalProteins / total) * 100) : 30,
      };
    })
  };
});
