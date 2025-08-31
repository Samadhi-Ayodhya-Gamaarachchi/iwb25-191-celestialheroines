// app/index.tsx (Entry point)
import "../global.css";
import { Redirect } from 'expo-router';

export default function Index() {
  // This will redirect to the appropriate screen based on auth state
  // The actual logic is handled in _layout.tsx
  return <Redirect href="/LoginScreen" />;
}