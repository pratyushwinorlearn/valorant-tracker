import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export default function ValorantWidget({ dashboard }) {
  if (!dashboard || !dashboard.account) {
    return (
      <FlexWidget style={styles.container}>
        <FlexWidget style={styles.centerBox}>
          <TextWidget text="VALO STATS" style={styles.fallbackTitle} />
          <TextWidget text="Open app to link Riot ID & sync rank" style={styles.fallbackSub} />
        </FlexWidget>
      </FlexWidget>
    );
  }

  const { account, rank, lastMatch, streak } = dashboard;
  const kdr = lastMatch ? (lastMatch.kills / Math.max(1, lastMatch.deaths)).toFixed(2) : '0.00';
  const outcomeText = lastMatch ? (lastMatch.won ? 'VICTORY' : 'DEFEAT') : 'N/A';
  const outcomeColor = lastMatch ? (lastMatch.won ? '#4ade80' : '#f87171') : '#ffffff';

  return (
    <FlexWidget style={styles.container}>
      {/* Header Section */}
      <FlexWidget style={styles.header}>
        <FlexWidget style={styles.columnLeft}>
          <FlexWidget style={styles.row}>
            <TextWidget text={account.name} style={styles.name} />
            <TextWidget text={`#${account.tag}`} style={styles.tag} />
          </FlexWidget>
          <TextWidget text={`${account.region.toUpperCase()} SERVER`} style={styles.region} />
        </FlexWidget>

        <FlexWidget style={styles.rightAlign}>
          <TextWidget text={rank.tier || 'UNRANKED'} style={styles.tier} />
          <TextWidget text={`${rank.rr || 0} RR`} style={styles.rr} />
        </FlexWidget>
      </FlexWidget>

      {/* Center Void: Translucent Map Watermark + 5 Match History Badges */}
      <FlexWidget style={styles.middleContainer}>
        <TextWidget 
          text={(lastMatch?.map || 'VALORANT').toUpperCase()} 
          style={styles.watermarkText} 
        />
        
        <FlexWidget style={styles.streakRow}>
          {streak && streak.length > 0 ? (
            streak.map((won, idx) => (
              <FlexWidget key={idx} style={won ? styles.badgeWin : styles.badgeLoss}>
                <TextWidget text={won ? "W" : "L"} style={styles.badgeText} />
              </FlexWidget>
            ))
          ) : (
            <TextWidget text="No recent match data" style={styles.noStreakText} />
          )}
        </FlexWidget>
      </FlexWidget>

      {/* Match Snapshot Section */}
      {lastMatch && (
        <FlexWidget style={styles.matchContainer}>
          <FlexWidget style={styles.column}>
            <TextWidget text="LAST MATCH" style={styles.label} />
            <TextWidget text={lastMatch.map} style={styles.value} />
            <TextWidget text={lastMatch.agent} style={styles.subtext} />
          </FlexWidget>

          <FlexWidget style={styles.columnCenter}>
            <TextWidget text="PERFORMANCE" style={styles.label} />
            <TextWidget 
              text={`${lastMatch.kills}/${lastMatch.deaths}/${lastMatch.assists}`} 
              style={styles.value} 
            />
            <TextWidget text={`KDR: ${kdr}`} style={styles.subtext} />
          </FlexWidget>

          <FlexWidget style={styles.columnRight}>
            <TextWidget text="OUTCOME" style={styles.label} />
            <TextWidget text={outcomeText} style={{ ...styles.value, color: outcomeColor }} />
            <TextWidget text={`${lastMatch.score} pts`} style={styles.subtext} />
          </FlexWidget>
        </FlexWidget>
      )}
    </FlexWidget>
  );
}

const styles = {
  container: {
    height: 'match_parent',
    width: 'match_parent',
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 16,
    borderColor: '#262626',
    borderWidth: 1,
    justifyContent: 'space-between', 
  },
  centerBox: {
    height: 'match_parent',
    width: 'match_parent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fallbackSub: {
    color: '#a3a3a3',
    fontSize: 12,
    marginTop: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 'match_parent',
  },
  columnLeft: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
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
  },
  rightAlign: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  tier: {
    color: '#e5e5e5',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rr: {
    color: '#a3a3a3',
    fontSize: 12,
  },
  middleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 'match_parent',
    marginVertical: 4,
  },
  watermarkText: {
    color: '#222222', // Subtle gray contrast matching the dark #171717 theme
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 6,
    textAlign: 'center',
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'match_parent',
    marginTop: -22, // Pulled slightly upward to overlap beautifully over the watermark text
  },
  badgeWin: {
    backgroundColor: '#1b4332', 
    borderColor: '#4ade80',
    borderWidth: 1,
    borderRadius: 6,
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
  },
  badgeLoss: {
    backgroundColor: '#641e16', 
    borderColor: '#f87171',
    borderWidth: 1,
    borderRadius: 6,
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  noStreakText: {
    color: '#737373',
    fontSize: 11,
  },
  matchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 'match_parent',
    borderTopWidth: 1, 
    borderColor: '#262626',
    paddingTop: 10,
  },
  column: {
    flexDirection: 'column',
    flex: 1,
  },
  columnCenter: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
  },
  columnRight: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {
    color: '#737373',
    fontSize: 10,
    marginBottom: 2,
  },
  value: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  subtext: {
    color: '#a3a3a3',
    fontSize: 12,
    marginTop: 2,
  },
};