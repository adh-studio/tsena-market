import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistStorage, StorageValue } from 'zustand/middleware';

/**
 * Thin persistence layer bridging Zustand's `persist` middleware to
 * AsyncStorage with JSON (de)serialisation. Kept generic so both the cart and
 * the favourites stores reuse it, and so it can later be swapped for
 * `expo-secure-store` or a remote sync without touching the stores.
 */
export function createJSONStorage<T>(): PersistStorage<T> {
  return {
    getItem: async (name): Promise<StorageValue<T> | null> => {
      const raw = await AsyncStorage.getItem(name);
      return raw ? (JSON.parse(raw) as StorageValue<T>) : null;
    },
    setItem: async (name, value): Promise<void> => {
      await AsyncStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: async (name): Promise<void> => {
      await AsyncStorage.removeItem(name);
    },
  };
}
