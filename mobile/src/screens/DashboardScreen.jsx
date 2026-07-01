import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView, ActivityIndicator } from 'react-native';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { getAccount } from '../storage/accountStorage';
import { fetchDashboard, fetchMatches } from '../api/client';

// Default import for the widget we just created
import ValorantWidget from '../widgets/ValorantWidget';

export default function DashboardScreen() {
  const [dashboard, setDashboard] = useState(null);
  const [matches, setMatches] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const account = await getAccount();
    if (!account) return;

    const [dash, recent] = await Promise.all([
      fetchDashboard(account.region, account.name, account.tag),
      fetchMatches(account.region, account.name, account.tag, 5),
    ]);
    
    setDashboard(dash);
    setMatches(recent);

    // Push the fresh data straight to the home screen widget.
    // Fixed the prop name to 'data' to match the ValorantWidget component
    await requestWidgetUpdate({
      widgetName: 'ValorantWidget',
      renderWidget: () => <ValorantWidget data={dash} />,
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (!dashboard) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f0c05a" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f0c05a" />}
    >
      {/* The modular widget replaces the old hardcoded Rank and Match cards. 
        It handles all of its own internal layout and styling.
      */}
      <View style={styles.widgetWrapper}>
        <ValorantWidget data={dashboard} />
      </View>

      <Text style={styles.sectionTitle}>Recent Matches</Text>
      {matches.map((m) => (
        <View key={m.matchId} style={styles.matchRow}>
          {/* Updated colors to match the widget's Tailwind-inspired scheme */}
          <Text style={[styles.rowResult, { color: m.won ? '#4ade80' : '#f87171' }]}>
            {m.won ? 'W' : 'L'}
          </Text>
          <Text style={styles.rowText}>
            {m.agent} on {m.map}
          </Text>
          <Text style={styles.rowKda}>
            {m.kills}/{m.deaths}/{m.assists}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121212' 
  },
  center: { 
    flex: 1, 
    backgroundColor: '#121212', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  widgetWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: { 
    color: '#f0c05a', 
    marginLeft: 16, 
    marginTop: 16, 
    marginBottom: 12, 
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#262626',
  },
  rowResult: { 
    width: 28, 
    fontWeight: '900',
    fontSize: 16,
  },
  rowText: { 
    color: '#e5e5e5', 
    flex: 1,
    fontWeight: '500', 
  },
  rowKda: { 
    color: '#a3a3a3',
    fontVariant: ['tabular-nums'], // Keeps numbers aligned
    fontWeight: '600',
  },
});