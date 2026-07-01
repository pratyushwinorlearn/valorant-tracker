import React, { useState, useEffect } from 'react';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { getAccount } from './src/storage/accountStorage';
import { widgetTaskHandler } from './src/widgets/widgetTaskHandler';
import LinkAccountScreen from './src/screens/LinkAccountScreen';
import DashboardScreen from './src/screens/DashboardScreen';

// Must run at module scope, not inside a component — this is how the OS
// wakes up your JS to re-render the widget in the background.
registerWidgetTaskHandler(widgetTaskHandler);

export default function App() {
  const [linked, setLinked] = useState(null);

  useEffect(() => {
    getAccount().then((acc) => setLinked(!!acc));
  }, []);

  if (linked === null) return null;

  return linked ? <DashboardScreen /> : <LinkAccountScreen onLinked={() => setLinked(true)} />;
}
