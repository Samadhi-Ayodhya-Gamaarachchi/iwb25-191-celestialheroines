import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { ChildProvider } from '@/context/ChildContext';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ChildProvider>
        <AppContent />
      </ChildProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // User is authenticated, redirect to main app
        router.replace('/(tabs)');
      } else {
        // User is not authenticated, redirect to login
        router.replace('/LoginScreen');
      }
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
      <Stack.Screen name="RegisterScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="Add_child" options={{ title: 'Add Child' }} />
      <Stack.Screen name="EditProfile_Parent" options={{ title: 'Edit Profile' }} />
    </Stack>
  );
}