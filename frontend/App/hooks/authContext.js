/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Provides the auth context React hook for the Expo mobile application.
 * Why: It shares stateful behavior across interface components.
 * Uses or links to: frontend/App/hooks/useAuth.js.
 * Imported or linked from: frontend/App.jsx, frontend/App/navigation/RootNavigator.jsx, frontend/App/navigation/TabNavigator.jsx, frontend/App/screens/BookingScreen.jsx, frontend/App/screens/ChatScreen.jsx, frontend/App/screens/HomeScreen.jsx, frontend/App/screens/Janitor/JanitorDashBoardScreen.jsx, frontend/App/screens/Janitor/JanitorRegistrationScreen.jsx; 4 more in docs/file-inventory.md.
 */

import React, { createContext, useContext, useState } from 'react';
import { useAuth as useAuthHook } from './useAuth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useAuthHook();
  // UI-only flag: lets a janitor temporarily browse the customer view.
  // Resets to false whenever the user logs out (hook re-mounts).
  const [viewAsCustomer, setViewAsCustomer] = useState(false);

  return (
    <AuthContext.Provider value={{ ...auth, viewAsCustomer, setViewAsCustomer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
