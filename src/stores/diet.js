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

  // State for tracking consumption
  const consumedMacros = ref({ fats: 0, carbs: 0, proteins: 0 });
  const checkedFoodIds = ref(new Set());

  // Mock Daily Targets (Should come from API)
  const dailyTargets = ref({
    fats: 70,
    carbs: 250,
    proteins: 180
  });

  // Actions
  function toggleFood(foodItem) {
    // Generate a unique ID for the item if it doesn't have one, or use a combination of name/amount
    const id = foodItem.id || `${foodItem.name}-${foodItem.amount}`;

    if (checkedFoodIds.value.has(id)) {
      // Uncheck: Subtract macros
      checkedFoodIds.value.delete(id);
      consumedMacros.value.fats -= foodItem.fats || 0;
      consumedMacros.value.carbs -= foodItem.carbs || 0;
      consumedMacros.value.proteins -= foodItem.proteins || 0;
    } else {
      // Check: Add macros
      checkedFoodIds.value.add(id);
      consumedMacros.value.fats += foodItem.fats || 0;
      consumedMacros.value.carbs += foodItem.carbs || 0;
      consumedMacros.value.proteins += foodItem.proteins || 0;
    }
  }

  // Computed
  const remainingMacros = computed(() => {
    const targets = dailyTargets.value || { fats: 70, carbs: 250, proteins: 180 };
    return {
      fats: Math.max(0, targets.fats - consumedMacros.value.fats),
      carbs: Math.max(0, targets.carbs - consumedMacros.value.carbs),
      proteins: Math.max(0, targets.proteins - consumedMacros.value.proteins)
    };
  });

  // Helper to map food items with macros
  const mapFoodWithMacros = (items) => items.map(item => ({
    id: item.id || `${item.food.name}-${item.amount}`,
    name: item.food.name,
    amount: `${item.amount} ${item.unit}`,
    fats: item.food.fatsG || 0,
    carbs: item.food.carbsG || 0,
    proteins: item.food.proteinsG || 0,
    isFixed: item.isFixed || false
  }));

  const fatsPlanned = computed(() => {
    return mapFoodWithMacros(allFoods.value.filter(item => item.food && item.food.fatsG > 5));
  });

  const carbsPlanned = computed(() => {
    return mapFoodWithMacros(allFoods.value.filter(item => item.food && item.food.carbsG > 10));
  });

  const proteinsPlanned = computed(() => {
    return mapFoodWithMacros(allFoods.value.filter(item => item.food && item.food.proteinsG > 5));
  });

  const fixedFoods = computed(() => {
    // Mocking Fixed Foods logic
    const fixed = allFoods.value.filter(item =>
      item.food && (item.food.name.toLowerCase().includes('batido') || item.food.name.toLowerCase().includes('creatina') || Math.random() > 0.8)
    );
    return mapFoodWithMacros(fixed).map(f => ({ ...f, isFixed: true }));
  });

  const recipes = computed(() => [
    { id: 1, name: 'Pollo al Curry con Arroz Basmati' },
    { id: 2, name: 'Tortilla de Claras con Avena' },
    { id: 3, name: 'Batido de Proteínas Post-Entreno' },
    { id: 4, name: 'Ensalada de Atún y Aguacate' }
  ]);

  const macrosDistribution = computed(() => {
    // Use daily targets for the chart distribution instead of just planned foods
    const total = dailyTargets.value.fats + dailyTargets.value.carbs + dailyTargets.value.proteins;
    return {
      fats: total ? Math.round((dailyTargets.value.fats / total) * 100) : 30,
      carbs: total ? Math.round((dailyTargets.value.carbs / total) * 100) : 40,
      proteins: total ? Math.round((dailyTargets.value.proteins / total) * 100) : 30,
    };
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
    fixedFoods,
    recipes,
    macrosDistribution,
    dailyTargets,
    consumedMacros,
    remainingMacros,
    checkedFoodIds,
    toggleFood
  };
});
