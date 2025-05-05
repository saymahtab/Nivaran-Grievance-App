import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import useAuthStore from '../store/authStore';
import './global.css';  

export default function RootLayout() {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const loading = false;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
