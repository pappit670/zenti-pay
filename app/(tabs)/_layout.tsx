import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Home, Wallet, BarChart3, Settings, DollarSign } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/contexts/ThemeContext';

export default function TabLayout() {
  const { theme } = useTheme();

  const tabBarBg = theme === 'light'
    ? 'rgba(255, 255, 255, 0.95)'
    : 'rgba(0, 0, 0, 0.9)';

  const activeTint = theme === 'light' ? '#3b82f6' : '#ffffff';
  const inactiveTint = theme === 'light'
    ? 'rgba(0, 0, 0, 0.5)'
    : 'rgba(255, 255, 255, 0.6)';

  const borderColor = theme === 'light'
    ? 'rgba(0, 0, 0, 0.1)'
    : 'rgba(255, 255, 255, 0.15)';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          height: 70,
          backgroundColor: tabBarBg,
          borderRadius: 24,
          borderTopWidth: 0,
          paddingBottom: 10,
          paddingTop: 10,
          shadowColor: theme === 'light' ? '#000' : '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: theme === 'light' ? 0.15 : 0.4,
          shadowRadius: 16,
          elevation: 12,
          borderWidth: 1,
          borderColor: borderColor,
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={50}
              tint={theme === 'light' ? 'light' : 'dark'}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 24,
                overflow: 'hidden',
              }}
            />
          ) : null
        ),
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ size, color }) => (
            <Wallet size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="pay"
        options={{
          title: 'Pay',
          tabBarIcon: ({ size, color, focused }) => (
            <DollarSign size={size + 4} color={color} strokeWidth={focused ? 3 : 2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
    </Tabs>
  );
}
