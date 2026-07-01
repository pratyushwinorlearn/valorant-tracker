import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { saveAccount } from '../storage/accountStorage';
import { fetchDashboard } from '../api/client';

const REGIONS = ['na', 'eu', 'ap', 'kr', 'latam', 'br'];

export default function LinkAccountScreen({ onLinked }) {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [region, setRegion] = useState('na');
  const [loading, setLoading] = useState(false);

  const handleLink = async () => {
    if (!name.trim() || !tag.trim()) {
      Alert.alert('Missing info', 'Enter both your Riot name and tag.');
      return;
    }
    setLoading(true);
    try {
      await fetchDashboard(region, name.trim(), tag.trim()); // confirms the account exists
      await saveAccount({ name: name.trim(), tag: tag.trim(), region });
      onLinked();
    } catch (err) {
      Alert.alert('Could not find account', 'Double check your Riot ID and region.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Link your Riot ID</Text>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 2 }]}
          placeholder="Name"
          placeholderTextColor="#8a8a8a"
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
        />
        <Text style={styles.hash}>#</Text>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="TAG"
          placeholderTextColor="#8a8a8a"
          value={tag}
          onChangeText={setTag}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.regionRow}>
        {REGIONS.map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.regionChip, region === r && styles.regionChipActive]}
            onPress={() => setRegion(r)}
          >
            <Text style={[styles.regionText, region === r && styles.regionTextActive]}>
              {r.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLink} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Checking...' : 'Link Account'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 24, justifyContent: 'center' },
  title: { color: '#f0c05a', fontSize: 24, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  input: { backgroundColor: '#1e1e1e', color: '#fff', padding: 12, borderRadius: 8, fontSize: 16 },
  hash: { color: '#fff', fontSize: 20, marginHorizontal: 8 },
  regionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24, justifyContent: 'center' },
  regionChip: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 16, backgroundColor: '#1e1e1e' },
  regionChipActive: { backgroundColor: '#f0c05a' },
  regionText: { color: '#8a8a8a', fontSize: 13, fontWeight: '600' },
  regionTextActive: { color: '#121212' },
  button: { backgroundColor: '#f0c05a', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#121212', fontWeight: '700', fontSize: 16 },
});
