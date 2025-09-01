import React from "react";
import { useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
    <View className="w-full flex-1 flex flex-col justify-center items-center bg-black relative">
      <View className="w-full space-y-1">
        <Text className="text-4xl text-green-600 font-semibold tracking-widest text-center">
          spotlight
        </Text>
        <Text className="text-sm text-green-700 text-center">
          sign in to continue
        </Text>
      </View>
      <View className="w-72 h-80">
        <Image
          source={require("@/assets/images/Login-bro.png")}
          resizeMode="cover"
          className="w-full h-full"
        />
      </View>

      <View className="w-2/3 mx-auto absolute bottom-6 space-y-2">
        <TouchableOpacity
          onPress={handleSignIn}
          activeOpacity={0.9}
          className="w-full flex flex-row p-3 justify-center items-center gap-2 bg-green-700 rounded-full"
        >
          <View className="inline">
            <Ionicons name="logo-google" size={18} color="#000" />
          </View>
          <Text className="text-lg font-semibold text-center">
            Continue with google
          </Text>
        </TouchableOpacity>

        <Text className="text-xs text-gray-400 text-center mt-3">
          By continuing you agree to our T&Cs
        </Text>
      </View>
    </View>
  );
};

export default SignIn;
