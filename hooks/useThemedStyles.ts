import { useTheme } from '@/contexts/ThemeContext';

export function useThemedStyles() {
  const { theme, colors } = useTheme();

  const gradientColors = theme === 'light'
    ? ['#f5f5f5', '#ffffff', '#f5f5f5']
    : ['#0a0a0a', '#1a1a2e', '#16213e'];

  const cardGradientColors = theme === 'light'
    ? ['rgba(0, 0, 0, 0.05)', 'rgba(0, 0, 0, 0.02)']
    : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)'];

  const blurTint = theme === 'light' ? 'light' : 'dark';

  return {
    theme,
    colors,
    gradientColors,
    cardGradientColors,
    blurTint,
  };
}
