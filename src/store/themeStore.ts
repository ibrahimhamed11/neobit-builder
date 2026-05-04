/**
 * {{APP_NAME}} — Theme Store (Zustand)
 *
 * Persists the user's dark/light/system preference across app restarts.
 */

import { create } from 'zustand';
import { Appearance } from 'react-native';
import { STORAGE_KEYS } from '../utils/constants';

let AsyncStorage: any = null;
const getAsyncStorage = async () => {
  if (!AsyncStorage) {
    AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
  }
  return AsyncStorage;
};

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeStore {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  hydrate: () => Promise<void>;
}

const getIsDark = (mode: ThemeMode): boolean => {
  if (mode === 'system') return Appearance.getColorScheme() === 'dark';
  return mode === 'dark';
};

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: 'system',
  isDark: getIsDark('system'),

  setMode: async (mode) => {
    const storage = await getAsyncStorage();
    await storage.setItem(STORAGE_KEYS.THEME, mode);
    set({ mode, isDark: getIsDark(mode) });
  },

  toggleTheme: async () => {
    const { mode } = useThemeStore.getState();
    const next: ThemeMode = mode === 'dark' ? 'light' : 'dark';
    const storage = await getAsyncStorage();
    await storage.setItem(STORAGE_KEYS.THEME, next);
    set({ mode: next, isDark: getIsDark(next) });
  },

  hydrate: async () => {
    try {
      const storage = await getAsyncStorage();
      const stored = (await storage.getItem(STORAGE_KEYS.THEME)) as ThemeMode | null;
      const mode: ThemeMode = stored ?? 'system';
      set({ mode, isDark: getIsDark(mode) });
    } catch {
      // Use system default on error
    }
  },
}));
