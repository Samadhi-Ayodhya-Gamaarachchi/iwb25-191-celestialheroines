// app/(tabs)/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Import components
import { ProfileHeader } from '../components/Profile/ProfileHeader';
import { ProfileCard } from '../components/Profile/ProfileCard';
import { NavigationTabs } from '../components/Profile/NavigationTab';
import { SettingsModal } from '../components/Profile/SettingsModel';
import { HelpModal } from '../components/Profile/HelpModel';

// Import context and updated components
import { useChild } from '../context/ChildContext';
import { useAuth } from '../context/AuthContext';
import { ChildrenSection } from '../components/Profile/ChildrenSection';

export default function ProfileScreen() {
  const { children, selectedChild } = useChild();
  const { logout } = useAuth();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const router = useRouter();

  const handleAddChild = () => {
    router.push('/Add_child');
  };

  const handleEditProfile = () => {
    router.push('/EditProfile_Parent');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/LoginScreen');
          },
        },
      ]
    );
  };

  const handleChildPress = (childName: string) => {
    // Show confirmation or navigate to home
    Alert.alert(
      'Child Selected', 
      `${childName} is now selected. You can view their health information on the Home screen.`,
      [
        {
          text: 'OK',
          style: 'default',
        },
        {
          text: 'Go to Home',
          onPress: () => router.push('/HomeScreen'),
          style: 'default',
        }
      ]
    );
  };

  // Show selected child info when component mounts or selectedChild changes
  useEffect(() => {
    if (selectedChild) {
      // You can add any logic here when selectedChild changes
      // Remove the Alert.alert from the JSX as it's not valid there
    }
  }, [selectedChild]);

  const tabs = [
    {
      id: 'children',
      label: 'Children',
    },
    {
      id: 'settings',
      label: 'Settings',
      onPress: () => setSettingsVisible(true),
    },
    {
      id: 'help',
      label: 'Help',
      onPress: () => setHelpVisible(true),
    },
    {
      id: 'logout',
      label: 'Logout',
      onPress: handleLogout,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ProfileHeader title="Profile" />

        <ProfileCard
          name="Sarah Fernando"
          role="Parent / Guardian"
          phone="+94 71 234 5678"
          email="sarah.f@gmail.com"
          avatar="S"
        />

        <NavigationTabs tabs={tabs} activeTabId="children" />

        {/* Use the updated ChildrenSection that works with context */}
        <ChildrenSection
          onAddChild={handleAddChild}
          onChildPress={handleChildPress}
        />
      </ScrollView>

      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        onEditProfile={handleEditProfile}
      />

      <HelpModal
        visible={helpVisible}
        onClose={() => setHelpVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});