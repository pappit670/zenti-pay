import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: 'none',
        },
      }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="scan" />
      <Tabs.Screen name="pay" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="wallet" options={{ href: null }} />
      <Tabs.Screen name="statistics" options={{ href: null }} />
    </Tabs>
  );
}
