import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './home';
import FreeScreen from './free';
import SellScreen from './sell';
import MyListingsScreen from './my-listings';
import ProfileScreen from './profile';

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
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
      <Tab.Screen name="MyListings" component={MyListingsScreen} options={{ title: 'My Listings' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
