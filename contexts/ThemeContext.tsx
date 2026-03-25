import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    success: string;
    error: string;
    cardOpacity: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const lightColors = {
  background: '#ffffff',
  card: '#f8f8f8',
  text: '#000000',
  textSecondary: '#666666',
  border: '#e0e0e0',
  primary: '#3b82f6',
  success: '#10b981',
  error: '#ef4444',
  cardOpacity: 'rgba(0, 0, 0, 0.05)',
};

const darkColors = {
  background: '#000000',
  card: 'rgba(255, 255, 255, 0.1)',
  text: '#ffffff',
  textSecondary: '#999999',
  border: 'rgba(255, 255, 255, 0.2)',
  primary: '#3b82f6',
  success: '#10b981',
  error: '#ef4444',
  cardOpacity: 'rgba(255, 255, 255, 0.05)',
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const colorScheme = Appearance.getColorScheme();
    if (colorScheme === 'light' || colorScheme === 'dark') {
      setTheme(colorScheme);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
