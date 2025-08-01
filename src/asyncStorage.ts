import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // handle error
    console.error('AsyncStorage setItem error:', e);
  }
};

export const getItem = async <T = any>(key: string): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (e) {
    // handle error
    console.error('AsyncStorage getItem error:', e);
    return null;
  }
};

export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // handle error
    console.error('AsyncStorage removeItem error:', e);
  }
}; 