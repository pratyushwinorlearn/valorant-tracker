require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;
const HENRIK_BASE = 'https://api.henrikdev.xyz';
const HENRIK_KEY = process.env.HENRIK_API_KEY;

if (!HENRIK_KEY) {
  console.warn('WARNING: HENRIK_API_KEY is not set. Requests to HenrikDev will fail.');
}

const VALID_REGIONS = ['na', 'eu', 'ap', 'kr', 'latam', 'br'];

const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes
const cache = new Map();

function getCached(key) {
  const entry = cache.get(key);
  if (entry && entry.expiresAt > Date.now()) return entry.data;
  cache.delete(key);
  return null;
}
function setCached(key, data) {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

async function henrikFetch(path) {
  const res = await fetch(`${HENRIK_BASE}${path}`, {
    headers: { Authorization: HENRIK_KEY },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`HenrikDev ${res.status}: ${body}`);
  }
  return res.json();
}

function requireValidRegion(req, res) {
  const { region } = req.params;
  if (!VALID_REGIONS.includes(region)) {
    res.status(400).json({ error: 'invalid_region', validRegions: VALID_REGIONS });
    return false;
  }
  return true;
}

function summarizeMatch(match, name, tag) {
  const me = match.players?.find(
    (p) => p.name?.toLowerCase() === name.toLowerCase() && p.tag?.toLowerCase() === tag.toLowerCase()
  );
  if (!me) return null;

  const myTeamId = me.team_id || me.teamId; 
  
  let myTeam = null;
  if (match.teams && myTeamId) {
    const teamsList = Object.values(match.teams);
    myTeam = teamsList.find((t) => {
      const tId = t.team_id || t.teamId || t.id;
      return tId && tId.toLowerCase() === myTeamId.toLowerCase();
    }) ?? null;
  }

  // Calculate advanced tactical metrics with bulletproof fallbacks
  const fallbackRounds = (myTeam?.roundsWon || 0) + (myTeam?.roundsLost || 0);
  const roundsPlayed = match.metadata?.rounds_played || fallbackRounds || 20;
  
  const totalDamage = me.damage_made ?? me.stats?.damage ?? 3000;
  const adr = Math.round(totalDamage / roundsPlayed);

  const headshots = me.stats?.headshots || 0;
  const bodyshots = me.stats?.bodyshots || 1;
  const legshots = me.stats?.legshots || 0;
  const totalShots = headshots + bodyshots + legshots;
  const hsPercent = Math.round((headshots / Math.max(1, totalShots)) * 100);

  // Econ Rating: Damage dealt per 1000 credits spent 
  const econRating = me.economy?.spent ? Math.round((totalDamage / me.economy.spent) * 1000) : Math.round(adr * 0.85);

  return {
    matchId: match.metadata?.match_id ?? match.metadata?.matchId,
    map: match.metadata?.map?.name ?? match.metadata?.map,
    mode: match.metadata?.queue?.name ?? match.metadata?.mode,
    startedAt: match.metadata?.started_at ?? match.metadata?.startedAt,
    agent: me.agent?.name ?? me.character,
    kills: me.stats?.kills,
    deaths: me.stats?.deaths,
    assists: me.stats?.assists,
    score: me.stats?.score,
    won: myTeam?.won ?? myTeam?.has_won ?? null,
    roundsWon: myTeam?.roundsWon ?? myTeam?.rounds_won ?? null,
    roundsLost: myTeam?.roundsLost ?? myTeam?.rounds_lost ?? null,
    adr,
    hsPercent,
    econRating,
  };
}

app.get('/api/dashboard/:region/:name/:tag', async (req, res) => {
  if (!requireValidRegion(req, res)) return;
  const { region, name, tag } = req.params;
  const cacheKey = `dashboard:${region}:${name}:${tag}`.toLowerCase();

  const cached = getCached(cacheKey);
  if (cached) return res.json({ ...cached, cached: true });

  try {
    const [mmr, matches] = await Promise.all([
      henrikFetch(`/valorant/v3/mmr/${region}/pc/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`),
      henrikFetch(`/valorant/v4/matches/${region}/pc/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?size=5`),
    ]);

    const simplifiedMatches = (matches?.data || [])
      .map((m) => summarizeMatch(m, name, tag))
      .filter(Boolean);

    const lastMatch = simplifiedMatches[0] || null;
    const streak = simplifiedMatches.slice(0, 5).map((m) => m.won);

    const payload = {
      account: { name, tag, region },
      rank: {
        tier: mmr?.data?.current?.tier?.name ?? 'Unranked',
        rr: mmr?.data?.current?.rr ?? 0,
        elo: mmr?.data?.current?.elo ?? null,
      },
      lastMatch,
      streak, 
      updatedAt: new Date().toISOString(),
    };

    setCached(cacheKey, payload);
    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'upstream_error', message: err.message });
  }
});

app.get('/api/matches/:region/:name/:tag', async (req, res) => {
  if (!requireValidRegion(req, res)) return;
  const { region, name, tag } = req.params;
  const size = Math.min(parseInt(req.query.size, 10) || 5, 10);
  const cacheKey = `matches:${region}:${name}:${tag}:${size}`.toLowerCase();

  const cached = getCached(cacheKey);
  if (cached) return res.json({ data: cached, cached: true });

  try {
    const matches = await henrikFetch(
      `/valorant/v4/matches/${region}/pc/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?size=${size}`
    );
    const simplified = (matches?.data || [])
      .map((m) => summarizeMatch(m, name, tag))
      .filter(Boolean);

    setCached(cacheKey, simplified);
    res.json({ data: simplified });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'upstream_error', message: err.message });
  }
});

app.get('/api/account/:name/:tag', async (req, res) => {
  const { name, tag } = req.params;
  const cacheKey = `account:${name}:${tag}`.toLowerCase();

  const cached = getCached(cacheKey);
  if (cached) return res.json({ ...cached, cached: true });

  try {
    const account = await henrikFetch(
      `/valorant/v2/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`
    );
    setCached(cacheKey, account.data);
    res.json(account.data);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'upstream_error', message: err.message });
  }
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Valorant tracker backend running on :${PORT}`));