import { defineStore } from 'pinia';


export const useDietStore = defineStore('diet', () => {
  console.log('--- Initializing Diet Store ---');
  return {
    dietPlan: null,
    loading: false,
    error: null,
    loadFromLocal: () => console.log('Mock loadFromLocal'),
    sync: () => console.log('Mock sync'),
    fatsPlanned: [],
    carbsPlanned: [],
    proteinsPlanned: []
  };
});
