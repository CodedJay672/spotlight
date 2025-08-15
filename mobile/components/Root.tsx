import React, { useEffect } from "react";
import {
  Redirect,
  SplashScreen,
  Stack,
  useRouter,
  useSegments,
} from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

const Root = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const segment = useSegments();

  useEffect(() => {
    if (!isLoaded) SplashScreen.hideAsync();

    if (!isSignedIn && segment[0] !== "(auth)")
      <Redirect href="/(auth)/login" />;
    else if (isSignedIn && segment[0] === "(auth)") return;
  }, [segment, router]);

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="index" />
      </Stack>
    </ClerkProvider>
  );
};

export default Root;
