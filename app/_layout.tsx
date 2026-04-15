import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { ModeProvider } from '@/contexts/ModeContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ZentiProvider } from '@/contexts/ZentiContext';
import ZentiIsland from '@/components/ZentiIsland';
import './global.css';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <ThemeProvider>
        <ModeProvider>
          <ZentiProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="auth/signin" />
              <Stack.Screen name="auth/signup" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="send-recipient" />
              <Stack.Screen name="request" />
              <Stack.Screen name="add-funds" />
              <Stack.Screen name="invoice/create" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <ZentiIsland />
            <StatusBar style="auto" />
          </ZentiProvider>
        </ModeProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
