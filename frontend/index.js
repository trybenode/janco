/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Configures or provides index functionality for the Expo mobile application.
 * Why: It groups this functionality for reuse or execution within the project.
 * Uses or links to: frontend/App.jsx.
 * Imported or linked from: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Entry point: Expo application entry point.
 */

import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
