import React from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import { FavoritesProvider } from './src/contexts/FavoritesContext';
import RootNavigator from './src/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <StatusBar style="auto" />
        <RootNavigator />
      </FavoritesProvider>
    </AuthProvider>
  );
}