import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'linkedRiotAccount';

export async function saveAccount({ name, tag, region }) {
  await AsyncStorage.setItem(KEY, JSON.stringify({ name, tag, region }));
}

export async function getAccount() {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function clearAccount() {
  await AsyncStorage.removeItem(KEY);
}
