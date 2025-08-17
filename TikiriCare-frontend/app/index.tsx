// app/_layout.tsx (Root layout)
import { Stack } from 'expo-router';
import "../global.css";
import { ChildProvider } from '@/context/ChildContext';

export default function RootLayout() {
  return (
    <ChildProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="Add_child" options={{ title: 'Add Child' }} />
        <Stack.Screen name="EditProfile_Parent" options={{ title: 'Edit Profile' }} />
      </Stack>
    </ChildProvider>
  );
}