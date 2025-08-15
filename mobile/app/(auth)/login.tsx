import React from "react";
import { useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

const SignIn = () => {
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });

      if (setActive && createdSessionId) {
        setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <View className="w-full flex-1 flex justify-center items-center bg-black relative">
      <View className="w-full space-y-1">
        <Text className="text-2xl text-green-600 font-semibold tracking-widest text-center">
          spotlight
        </Text>
        <Text className="text-sm text-green-700 text-center">
          sign in to continue
        </Text>
      </View>

      <Pressable
        onPress={handleSignIn}
        className="w-2/3 mx-auto bg-black border border-green-500 rounded-full p-2 absolute bottom-10 left-auto"
      >
        <Text className="text-base text-green-700 font-bold text-center">
          Continue with google
        </Text>
      </Pressable>
    </View>
  );
};

export default SignIn;
