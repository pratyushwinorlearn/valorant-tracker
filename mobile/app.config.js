export default ({ config }) => ({
  ...config,
  name: 'Valorant Tracker',
  slug: 'valorant-tracker',
  scheme: 'valorant-tracker',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'dark',
  android: {
    package: 'com.praty.valoranttracker',
    // Your backend isn't behind HTTPS (like the Pratify droplet setup) — Android
    // blocks plain HTTP by default from API 28+, so this allows it for now.
    // Swap to HTTPS via nginx + certbot later and remove this.
    usesCleartextTraffic: true,
  },
  plugins: [
    [
      'react-native-android-widget',
      {
        widgets: [
          {
            name: 'ValorantWidget',
            label: 'Valorant Tracker',
            minWidth: '320dp',
            minHeight: '180dp',
            targetCellWidth: 4,
            targetCellHeight: 2,
            description: 'Rank and last match at a glance',
            updatePeriodMillis: 1800000, // 30 min — Android won't go faster than this anyway
          },
        ],
      },
    ],
  ],
  extra: {
    // Point this at your droplet, e.g. "http://your.droplet.ip:3001"
    backendUrl: process.env.BACKEND_URL || 'https://preambitious-lemonish-myesha.ngrok-free.dev',
  },
});
