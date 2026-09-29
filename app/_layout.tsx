import { useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function RootLayout() {
  // Single client instance kept stable for the whole app lifetime.
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60, // 1 min: catalogue rarely changes within a session
            retry: 1,
          },
        },
      })
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={client}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="product/[id]"
            options={{ headerShown: true, title: 'Produit', headerBackTitle: 'Retour' }}
          />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
