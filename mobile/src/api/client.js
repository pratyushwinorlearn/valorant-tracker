import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.backendUrl;

export async function fetchDashboard(region, name, tag) {
  const res = await fetch(
    `${BASE_URL}/api/dashboard/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`
  );
  if (!res.ok) throw new Error(`Dashboard fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchMatches(region, name, tag, size = 5) {
  const res = await fetch(
    `${BASE_URL}/api/matches/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?size=${size}`
  );
  if (!res.ok) throw new Error(`Matches fetch failed: ${res.status}`);
  const json = await res.json();
  return json.data;
}
