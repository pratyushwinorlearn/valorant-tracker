import { registerRootComponent } from 'expo';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import App from './App';

// Import your custom widget task handler
// (Make sure this path matches exactly where your file is located)
import { widgetTaskHandler } from './src/widgets/widgetTaskHandler'; 

// 1. Register the background widget task so Android can see it
registerWidgetTaskHandler(widgetTaskHandler);

// 2. Register the main application
registerRootComponent(App);