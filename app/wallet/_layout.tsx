import { Stack } from 'expo-router';

export default function WalletLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="setup" />
      <Stack.Screen name="ready" />
      <Stack.Screen name="detail" />
      <Stack.Screen name="tap-hold" />
    </Stack>
  );
}
