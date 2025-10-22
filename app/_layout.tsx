import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "@/contexts/AppContext";
import { LicenseProvider } from "@/contexts/LicenseContext";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { trpc, trpcClient } from "@/lib/trpc";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="day" />
      <Stack.Screen name="search" />
      <Stack.Screen name="astrology" />
      <Stack.Screen name="sign" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="stack-editor" />
      <Stack.Screen name="help" />
      <Stack.Screen name="month-overrides" />
      <Stack.Screen name="visual-libraries" options={{ title: 'Visual Libraries' }} />
      <Stack.Screen name="event-editor" options={{ title: 'Event' }} />
      <Stack.Screen name="event-detail" options={{ title: 'Event' }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={styles.container}>
          <SafeAreaProvider>
            <LicenseProvider>
              <AppProvider>
                <RootLayoutNav />
              </AppProvider>
            </LicenseProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
