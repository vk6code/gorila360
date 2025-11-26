import { dbService } from './db';
import { apolloClient } from '@/apollo';
import gql from 'graphql-tag';

// Query to fetch the full diet plan (Snapshot Sync)
// In a full Delta Sync implementation, this would accept a lastSync timestamp
// and return only changes. For now, we fetch the latest state and update local DB.
const GET_FULL_DIET_PLAN = gql`
  query GetUserDietPlan($userId: ID!) {
    dietPlan(userId: $userId) {
      name
      meals {
        name
        foods {
          amount
          unit
          food {
            name
            proteinsG
            fatsG
            carbsG
          }
        }
      }
    }
  }
`;

export const syncService = {
  /**
   * Syncs the diet plan for a specific user.
   * 1. Fetches latest data from server.
   * 2. Updates local IndexedDB.
   * 3. Updates lastSync timestamp.
   * @param {string} userId
   */
  async syncDiet(userId) {
    if (!userId) return;

    try {
      const lastSync = await dbService.getLastSync('diet_plans');
      console.log(`[Sync] Syncing diet for user ${userId}. Last sync: ${lastSync}`);

      // Perform network request
      const { data } = await apolloClient.query({
        query: GET_FULL_DIET_PLAN,
        variables: { userId },
        fetchPolicy: 'network-only' // Ensure we get fresh data from server
      });

      if (data && data.dietPlan) {
        // Save to local DB
        // We wrap the plan with the userId to serve as the primary key
        const planToSave = {
          userId: userId,
          ...data.dietPlan,
          _updatedAt: new Date().toISOString() // Internal timestamp
        };

        await dbService.saveDietPlan(planToSave);

        // Update sync metadata
        // In a real delta sync, the server returns the timestamp of the snapshot
        await dbService.setLastSync('diet_plans', new Date().toISOString());

        console.log('[Sync] Diet plan synced successfully.');
        return planToSave;
      }
    } catch (error) {
      console.error('[Sync] Error syncing diet:', error);
      throw error; // Propagate error so store knows sync failed (e.g. offline)
    }
  }
};
