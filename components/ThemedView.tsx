import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { ReactNode } from 'react';

interface ThemedViewProps {
  children: ReactNode;
  style?: any;
}

export function ThemedView({ children, style }: ThemedViewProps) {
  const { theme, colors } = useTheme();

  const gradientColors = (theme === 'light'
    ? ['#f5f5f5', '#ffffff', '#f5f5f5']
    : ['#0a0a0a', '#1a1a2e', '#16213e']) as [string, string, ...string[]];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
