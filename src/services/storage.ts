import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage Keys
const STORAGE_KEYS = {
  USER_INFO: '@newspanda:user_info',
  SELECTED_TOPICS: '@newspanda:selected_topics',
  ONBOARDING_COMPLETED: '@newspanda:onboarding_completed',
  STREAK: '@newspanda:streak',
  XP: '@newspanda:xp',
};

// User Info Storage
export const saveUserInfo = async (userInfo: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
  } catch (error) {
    console.error('Error saving user info:', error);
  }
};

export const getUserInfo = async (): Promise<any | null> => {
  try {
    const userInfo = await AsyncStorage.getItem(STORAGE_KEYS.USER_INFO);
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};

export const clearUserInfo = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_INFO);
  } catch (error) {
    console.error('Error clearing user info:', error);
  }
};

// Topics Storage
export const saveSelectedTopics = async (topics: string[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_TOPICS, JSON.stringify(topics));
  } catch (error) {
    console.error('Error saving topics:', error);
  }
};

export const getSelectedTopics = async (): Promise<string[]> => {
  try {
    const topics = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_TOPICS);
    return topics ? JSON.parse(topics) : [];
  } catch (error) {
    console.error('Error getting topics:', error);
    return [];
  }
};

export const clearSelectedTopics = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SELECTED_TOPICS);
  } catch (error) {
    console.error('Error clearing topics:', error);
  }
};

// Onboarding Status
export const setOnboardingCompleted = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
  } catch (error) {
    console.error('Error setting onboarding status:', error);
  }
};

export const isOnboardingCompleted = async (): Promise<boolean> => {
  try {
    const completed = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return completed === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

// Streak Storage
export const saveStreak = async (streak: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.STREAK, streak.toString());
  } catch (error) {
    console.error('Error saving streak:', error);
  }
};

export const getStreak = async (): Promise<number> => {
  try {
    const streak = await AsyncStorage.getItem(STORAGE_KEYS.STREAK);
    return streak ? parseInt(streak, 10) : 0;
  } catch (error) {
    console.error('Error getting streak:', error);
    return 0;
  }
};

// XP Storage
export const saveXP = async (xp: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.XP, xp.toString());
  } catch (error) {
    console.error('Error saving XP:', error);
  }
};

export const getXP = async (): Promise<number> => {
  try {
    const xp = await AsyncStorage.getItem(STORAGE_KEYS.XP);
    return xp ? parseInt(xp, 10) : 0;
  } catch (error) {
    console.error('Error getting XP:', error);
    return 0;
  }
};

// Clear all app data
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_INFO,
      STORAGE_KEYS.SELECTED_TOPICS,
      STORAGE_KEYS.ONBOARDING_COMPLETED,
      STORAGE_KEYS.STREAK,
      STORAGE_KEYS.XP,
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};
