import { MD3LightTheme } from 'react-native-paper';

export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4BA3FF',
    secondary: '#10B981',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: '#111827'
  },
  fonts: {
    ...MD3LightTheme.fonts,
    bodyLarge: { ...MD3LightTheme.fonts.bodyLarge, fontFamily: 'Poppins_400Regular' },
    bodyMedium: { ...MD3LightTheme.fonts.bodyMedium, fontFamily: 'Poppins_400Regular' },
    titleMedium: { ...MD3LightTheme.fonts.titleMedium, fontFamily: 'Poppins_600SemiBold' },
    titleLarge: { ...MD3LightTheme.fonts.titleLarge, fontFamily: 'Poppins_600SemiBold' }
  }
};
