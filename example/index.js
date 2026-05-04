/**
 * @format
 */

// Load diagnostics FIRST, before anything else
require('./diagnostics.js');

import {AppRegistry} from 'react-native';
import App from './app.js';
import {name as appName} from './app.json';

console.log('[INDEX] Registering app component:', appName);
AppRegistry.registerComponent(appName, () => App);
