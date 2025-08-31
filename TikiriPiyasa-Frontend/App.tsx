import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './global.css';
import MainLayout from './src/layouts/MainLayout';
import ChildDetailsScreen from './src/screens/ChildDetails';
import ChildrenListScreen from './src/screens/ChildrenListScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RequestScreen from './src/screens/RequestScreen';

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

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
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
            {/* <Stack.Screen name="Parents" component={WrappedParentsScreen} /> */}
          </Stack.Navigator>
          <StatusBar style="auto" />
        </SafeAreaView>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
