/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Renders the janitor chat screen in the Expo mobile application.
 * Why: It provides a navigable screen in the mobile experience.
 * Uses or links to: frontend/App/screens/ChatScreen.jsx.
 * Imported or linked from: None identified by static analysis; framework, runtime, or external consumers may exist.
 */

import React from 'react';
import ChatScreen from '../ChatScreen';

export default function JanitorChatScreen({ route }) {
  return <ChatScreen route={{ params: { ...(route?.params || {}), role: 'janitor' } }} />;
}
