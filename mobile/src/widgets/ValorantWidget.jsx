import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ValorantWidget({ data }) {
  if (!data) return null;

  const { account, rank, lastMatch } = data;
  const kdr = lastMatch ? (lastMatch.kills / Math.max(1, lastMatch.deaths)).toFixed(2) : '0.00';

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <View style={styles.row}>
            <Text style={styles.name}>{account.name}</Text>
            <Text style={styles.tag}>#{account.tag}</Text>
          </View>
          <Text style={styles.region}>{account.region.toUpperCase()} SERVER</Text>
        </View>
        <View style={styles.rightAlign}>
          <Text style={styles.tier}>{rank.tier}</Text>
          <Text style={styles.rr}>{rank.rr} RR</Text>
        </View>
      </View>

      {/* Match Snapshot Section */}
      {lastMatch && (
        <View style={styles.matchContainer}>
          <View style={styles.column}>
            <Text style={styles.label}>LAST MATCH</Text>
            <Text style={styles.value}>{lastMatch.map}</Text>
            <Text style={styles.subtext}>{lastMatch.agent}</Text>
          </View>

          <View style={styles.columnCenter}>
            <Text style={styles.label}>PERFORMANCE</Text>
            <Text style={styles.value}>
              {lastMatch.kills}/{lastMatch.deaths}/{lastMatch.assists}
            </Text>
            <Text style={styles.subtext}>KDR: {kdr}</Text>
          </View>

          <View style={styles.columnRight}>
            <Text style={styles.label}>OUTCOME</Text>
            <Text style={[styles.value, lastMatch.won ? styles.textWin : styles.textLoss]}>
              {lastMatch.won ? 'VICTORY' : 'DEFEAT'}
            </Text>
            <Text style={styles.subtext}>{lastMatch.score} pts</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#262626',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8, // For Android shadow
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  name: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tag: {
    color: '#737373',
    fontSize: 12,
    marginLeft: 4,
  },
  region: {
    color: '#a3a3a3',
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 1,
  },
  rightAlign: {
    alignItems: 'flex-end',
  },
  tier: {
    color: '#e5e5e5',
    fontSize: 14,
    fontWeight: '700',
  },
  rr: {
    color: '#a3a3a3',
    fontSize: 12,
  },
  matchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#262626',
    paddingTop: 12,
  },
  column: {
    flex: 1,
  },
  columnCenter: {
    flex: 1,
    alignItems: 'center',
  },
  columnRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {
    color: '#737373',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  value: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  subtext: {
    color: '#a3a3a3',
    fontSize: 12,
    marginTop: 2,
  },
  textWin: {
    color: '#4ade80', // Tailwind green-400 equivalent
  },
  textLoss: {
    color: '#f87171', // Tailwind red-400 equivalent
  },
});