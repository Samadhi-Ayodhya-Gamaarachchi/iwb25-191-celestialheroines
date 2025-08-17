import React from 'react';
import { Tabs } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#1E90FF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { 
          backgroundColor: '#fff', 
          paddingBottom: 5, 
          height: 60,
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: string;
          
          switch (route.name) {
            case 'HomeScreen':
              iconName = 'home-outline';
              break;
            case 'HealthScreen':
              iconName = 'heart-outline';
              break;
            case 'CareCenterScreen':
              iconName = 'business-outline';
              break;
            case 'ProfileScreen':
              iconName = 'person-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen 
        name="HomeScreen" 
        options={{ 
          title: 'Home',
          tabBarLabel: 'Home',
      }} 
      />
      <Tabs.Screen 
        name="HealthScreen" 
        options={{ 
          title: 'Health',
          tabBarLabel: 'Health',
        }} 
      />
      <Tabs.Screen 
        name="CareCenterScreen" 
        options={{ 
          title: 'Care Center',
          tabBarLabel: 'Care',
        }} 
      />
      <Tabs.Screen 
        name="ProfileScreen" 
        options={{ 
          title: 'Profile',
          tabBarLabel: 'Profile',
        }} 
      />
      {/* Hide the index tab since we're using HomeScreen */}
      <Tabs.Screen 
        name="index" 
        options={{ 
          href: null, // This hides the tab
        }} 
      />
    </Tabs>
  );
}
