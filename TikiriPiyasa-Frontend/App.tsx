import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './global.css';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import MainLayout from './src/layouts/MainLayout';
import ChildDetailsScreen from './src/screens/ChildDetails';
import ChildrenListScreen from './src/screens/ChildrenListScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import RequestScreen from './src/screens/RequestScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

// Wrap each screen with MainLayout
const WrappedHomeScreen = () => (
  <MainLayout>
    <HomeScreen />
  </MainLayout>
);

const WrappedSearchScreen = () => (
  <MainLayout>
    <View style={{flex: 1}}><Text>Search</Text></View>
  </MainLayout>
);

const WrappedCartScreen = () => (
  <MainLayout>
    <View style={{flex: 1}}><Text>Cart</Text></View>
  </MainLayout>
);

const WrappedOrdersScreen = () => (
  <MainLayout>
    <View style={{flex: 1}}><Text>Orders</Text></View>
  </MainLayout>
);

const WrappedProfileScreen = () => (
  <MainLayout>
    <ProfileScreen />
  </MainLayout>
);

const WrappedRequestScreen = () => (
  <MainLayout>
    <RequestScreen />
  </MainLayout>
);

const WrappedChildrenScreen = () => (
  <MainLayout>
    <ChildrenListScreen />
  </MainLayout>
);

const WrappedChildDetailsScreen = () => (
  <MainLayout>
    <ChildDetailsScreen />
  </MainLayout>
);

const Stack = createNativeStackNavigator();

// Authentication wrapper component
const AuthWrapper: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (user && !showWelcome) {
      setShowWelcome(true);
      // Auto-hide welcome screen after 3 seconds
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // If user is not logged in, show authentication screens
  if (!user) {
    return (
      <View style={styles.container}>
        {showLogin ? (
          <LoginScreen onNavigateToRegister={() => setShowLogin(false)} />
        ) : (
          <RegistrationScreen onNavigateToLogin={() => setShowLogin(true)} />
        )}
      </View>
    );
  }

  // Show welcome screen briefly after login
  if (showWelcome) {
    return <WelcomeScreen />;
  }

  // If user is logged in, show the main app
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={WrappedHomeScreen} />
      <Stack.Screen name="Search" component={WrappedSearchScreen} />
      <Stack.Screen name="Cart" component={WrappedCartScreen} />
      <Stack.Screen name="Orders" component={WrappedOrdersScreen} />
      <Stack.Screen name="Request" component={WrappedRequestScreen} />
      <Stack.Screen name="Profile" component={WrappedProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Children" component={WrappedChildrenScreen} />
      <Stack.Screen name="ChildDetails" component={WrappedChildDetailsScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <AuthWrapper />
            <StatusBar style="auto" />
          </SafeAreaView>
        </SafeAreaProvider>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
});
