// app/(tabs)/ProfileScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Import components
import { ProfileHeader } from '../components/Profile/ProfileHeader';
import { ProfileCard } from '../components/Profile/ProfileCard';
import { NavigationTabs } from '../components/Profile/NavigationTab';
import { ChildrenSection } from '../components/Profile/ChildrenSection';
import { SettingsModal } from '../components/Profile/SettingsModel';
import { HelpModal } from '../components/Profile/HelpModel';
import { Child } from '../components/Profile/ChildCard';

export default function ProfileScreen() {
  const [children, setChildren] = useState<Child[]>([
    {
      id: 1,
      name: 'Malith Fernando',
      age: '2 years 3 months',
      gender: 'Male',
      avatar: 'M',
      color: '#4A90E2',
    },
    {
      id: 2,
      name: 'Amaya Fernando',
      age: '6 months',
      gender: 'Female',
      avatar: 'A',
      color: '#E94B7D',
    },
  ]);

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const router = useRouter();

  const handleAddChild = () => {
    router.push('/Add_child');
  };

  const handleEditProfile = () => {
    router.push('/EditProfile_Parent');
  };

  const handleChildPress = (childName: string) => {
    Alert.alert('Child Details', `View details for ${childName}`);
  };

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

        <ChildrenSection
          children={children}
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