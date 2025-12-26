import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { View, ActivityIndicator } from 'react-native';

import { AuthProvider } from './src/hooks/useAuth';
import { paperTheme } from './src/theme/paperTheme';

// screens
import HomeScreen from './app/(tabs)/home';
import FreeScreen from './app/(tabs)/free';
import SellScreen from './app/(tabs)/sell';
import MyListingsScreen from './app/(tabs)/my-listings';
import ProfileScreen from './app/(tabs)/profile';
import LoginScreen from './app/auth/login';
import RegisterScreen from './app/auth/register';
import ListingDetailScreen from './app/listing/[id]';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabsLayout() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: { backgroundColor: '#FFFFFF' },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Free') iconName = 'gift';
          else if (route.name === 'Sell') iconName = 'plus-box';
          else if (route.name === 'MyListings') iconName = 'book-multiple';
          else if (route.name === 'Profile') iconName = 'account-circle';
          return <Icon name={iconName} color={color} size={size} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Free" component={FreeScreen} />
      <Tab.Screen name="Sell" component={SellScreen} />
      <Tab.Screen
        name="MyListings"
        component={MyListingsScreen}
        options={{ title: 'My Listings' }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function Root() {
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

export default Root;
