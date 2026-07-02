import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

// Helper function to return thematic colors based on competitive tier
function getRankTheme(tierName) {
  const tier = (tierName || 'UNRANKED').toUpperCase();
  if (tier.includes('IRON')) return { text: '#a3a3a3', bg: '#a3a3a315', border: '#a3a3a340' };
  if (tier.includes('BRONZE')) return { text: '#b45309', bg: '#b4530915', border: '#b4530940' };
  if (tier.includes('SILVER')) return { text: '#cbd5e1', bg: '#cbd5e115', border: '#cbd5e140' };
  if (tier.includes('GOLD')) return { text: '#eab308', bg: '#eab30820', border: '#eab30860' };
  if (tier.includes('PLATINUM')) return { text: '#22d3ee', bg: '#22d3ee15', border: '#22d3ee50' };
  if (tier.includes('DIAMOND')) return { text: '#c084fc', bg: '#c084fc15', border: '#c084fc50' };
  if (tier.includes('ASCENDANT')) return { text: '#22c55e', bg: '#22c55e20', border: '#22c55e60' };
  if (tier.includes('IMMORTAL')) return { text: '#f43f5e', bg: '#f43f5e20', border: '#f43f5e60' };
  if (tier.includes('RADIANT')) return { text: '#facc15', bg: '#facc1525', border: '#facc1570' };
  return { text: '#ffffff', bg: '#ffffff10', border: '#ffffff20' };
}

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

  // Get dynamic coloring setup for competitive rank display
  const rankTheme = getRankTheme(rank.tier);

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

        {/* Dynamic Glowing Rank Container Block */}
        <FlexWidget 
          style={{ 
            ...styles.rankBadgeContainer, 
            backgroundColor: rankTheme.bg, 
            borderColor: rankTheme.border 
          }}
        >
          <TextWidget text={rank.tier || 'UNRANKED'} style={{ ...styles.tier, color: rankTheme.text }} />
          <TextWidget text={`${rank.rr || 0} RR`} style={styles.rr} />
        </FlexWidget>
      </FlexWidget>

      {/* Center Tactical Container: Left-Aligned Streak + Right-Aligned Bento Metrics Grid */}
      <FlexWidget style={styles.tacticalSplitArea}>
        
        {/* Left Side: Recent Form History Strip */}
        <FlexWidget style={styles.leftStreakSection}>
          <TextWidget text="FORM (LAST 5)" style={styles.bentoMiniLabel} />
          <FlexWidget style={styles.streakVerticalBlock}>
            {streak && streak.length > 0 ? (
              streak.map((won, idx) => (
                <FlexWidget key={idx} style={won ? styles.badgeWin : styles.badgeLoss}>
                  <TextWidget text={won ? "W" : "L"} style={styles.badgeText} />
                </FlexWidget>
              ))
            ) : (
              <TextWidget text="--" style={styles.subtext} />
            )}
          </FlexWidget>
        </FlexWidget>

        {/* Right Side: Advanced Performance Bento Dashboard Grid */}
        <FlexWidget style={styles.rightBentoGrid}>
          <FlexWidget style={styles.bentoRow}>
            <FlexWidget style={styles.bentoBox}>
              <TextWidget text="HS%" style={styles.bentoMiniLabel} />
              <TextWidget text={`${lastMatch?.hsPercent ?? 0}%`} style={styles.bentoValueText} />
            </FlexWidget>
            <FlexWidget style={styles.bentoBox}>
              <TextWidget text="ADR" style={styles.bentoMiniLabel} />
              <TextWidget text={`${lastMatch?.adr ?? 0}`} style={styles.bentoValueText} />
            </FlexWidget>
            <FlexWidget style={styles.bentoBox}>
              <TextWidget text="ECON" style={styles.bentoMiniLabel} />
              <TextWidget text={`${lastMatch?.econRating ?? 0}`} style={styles.bentoValueText} />
            </FlexWidget>
          </FlexWidget>
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
    padding: 14,
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
  rankBadgeContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  tier: {
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  rr: {
    color: '#a3a3a3',
    fontSize: 11,
    marginTop: 1,
  },
  tacticalSplitArea: {
    flexDirection: 'row',
    flex: 1,
    width: 'match_parent',
    marginVertical: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftStreakSection: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingRight: 8,
  },
  streakVerticalBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  badgeWin: {
    backgroundColor: '#1b4332', 
    borderColor: '#4ade80',
    borderWidth: 1,
    borderRadius: 5,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  badgeLoss: {
    backgroundColor: '#641e16', 
    borderColor: '#f87171',
    borderWidth: 1,
    borderRadius: 5,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  rightBentoGrid: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  bentoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bentoBox: {
    backgroundColor: '#202020',
    borderColor: '#2d2d2d',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginLeft: 6,
    alignItems: 'center',
  },
  bentoMiniLabel: {
    color: '#737373',
    fontSize: 9,
    fontWeight: 'bold',
  },
  bentoValueText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 2,
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
    fontSize: 13,
    fontWeight: 'bold',
  },
  subtext: {
    color: '#a3a3a3',
    fontSize: 11,
    marginTop: 2,
  },
};