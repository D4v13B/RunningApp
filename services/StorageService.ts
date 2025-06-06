import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Define user profile interface
export interface UserProfile {
  name: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
}

// Keys for storage
const KEYS = {
  IS_FIRST_LAUNCH: 'isFirstLaunch',
  USER_PROFILE: 'userProfile',
  THEME: 'theme',
};

// For web, we need to use localStorage as a fallback since SecureStore is not available
const storeData = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  
  await SecureStore.setItemAsync(key, value);
};

const getData = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  
  return await SecureStore.getItemAsync(key);
};

class StorageService {
  // Check if it's the first launch
  async isFirstLaunch(): Promise<boolean> {
    const value = await getData(KEYS.IS_FIRST_LAUNCH);
    return value === null || value === 'true';
  }

  // Set first launch status
  async setFirstLaunch(isFirst: boolean): Promise<void> {
    await storeData(KEYS.IS_FIRST_LAUNCH, isFirst.toString());
  }

  // Save user profile
  async saveUserProfile(profile: UserProfile): Promise<void> {
    await storeData(KEYS.USER_PROFILE, JSON.stringify(profile));
  }

  // Get user profile
  async getUserProfile(): Promise<UserProfile | null> {
    const data = await getData(KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  }

  // Save theme preference
  async saveTheme(isDark: boolean): Promise<void> {
    await storeData(KEYS.THEME, isDark.toString());
  }

  // Get theme preference
  async getTheme(): Promise<boolean | null> {
    const theme = await getData(KEYS.THEME);
    return theme ? theme === 'true' : null;
  }

  // Clear all data (for testing)
  async clearAll(): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.clear();
      return;
    }
    
    const keys = Object.values(KEYS);
    for (const key of keys) {
      await SecureStore.deleteItemAsync(key);
    }
  }
}

// Export as singleton
export const Storage = new StorageService();