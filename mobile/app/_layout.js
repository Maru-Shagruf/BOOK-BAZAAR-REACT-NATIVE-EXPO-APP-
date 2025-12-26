import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider } from '../src/hooks/useAuth';
import { paperTheme } from '../src/theme/paperTheme';
import TabsLayout from './(tabs)/_layout';
import LoginScreen from './auth/login';
import RegisterScreen from './auth/register';
  import ListingDetailScreen from './listing/[id]';
const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4BA3FF" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={TabsLayout} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ListingDetail" component={ListingDetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}
