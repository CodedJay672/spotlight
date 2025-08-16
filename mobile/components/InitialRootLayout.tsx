import React, { useEffect } from "react";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

const InitialRootLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const segment = useSegments();

  useEffect(() => {
    if (!isLoaded) SplashScreen.hideAsync();
    const authScreen = segment[0] === "(auth)";

    if (isSignedIn && authScreen) router.replace("/(tabs)");
    else if (!isSignedIn && !authScreen) router.replace("/(auth)/login");
  }, [segment, isLoaded, isSignedIn]);

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default InitialRootLayout;
