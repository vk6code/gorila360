import { openDB } from 'idb';

const DB_NAME = 'gorila360_db';
const DB_VERSION = 1;

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    // Store for Diet Plans
    // Key: userId
    if (!db.objectStoreNames.contains('diet_plans')) {
      db.createObjectStore('diet_plans', { keyPath: 'userId' });
    }

    // Store for Sync Metadata (lastSync timestamps)
    // Key: table (e.g., 'diet_plans')
    if (!db.objectStoreNames.contains('sync_metadata')) {
      db.createObjectStore('sync_metadata', { keyPath: 'table' });
    }

    // Store for Offline Mutation Queue
    // Key: id (UUID)
    if (!db.objectStoreNames.contains('offline_queue')) {
      const queueStore = db.createObjectStore('offline_queue', { keyPath: 'id' });
      queueStore.createIndex('timestamp', 'timestamp');
    }
  },
});

export const dbService = {
  async getDietPlan(userId) {
    return (await dbPromise).get('diet_plans', userId);
  },
  async saveDietPlan(plan) {
    // plan object must contain userId as key
    return (await dbPromise).put('diet_plans', plan);
  },
  async getLastSync(table) {
    const record = await (await dbPromise).get('sync_metadata', table);
    return record ? record.timestamp : null;
  },
  async setLastSync(table, timestamp) {
    return (await dbPromise).put('sync_metadata', { table, timestamp });
  },
  async addToQueue(mutation) {
    return (await dbPromise).add('offline_queue', mutation);
  },
  async getQueue() {
    return (await dbPromise).getAllFromIndex('offline_queue', 'timestamp');
  },
  async removeFromQueue(id) {
    return (await dbPromise).delete('offline_queue', id);
  }
};
