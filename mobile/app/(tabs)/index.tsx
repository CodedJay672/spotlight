import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useClerk } from "@clerk/clerk-expo";

const Homepage = () => {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const { signOut } = useClerk();

  const handleSignout = async () => {
    try {
      setLoggingOut(true);
      await signOut();

      router.replace("/");
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (loggingOut) {
    return (
      <View className="w-full flex-1 flex-col justify-center items-center gap-1 bg-black">
        <ActivityIndicator size="large" color="green" />
        <Text>Logging out...</Text>
      </View>
    );
  }

  return (
    <View className="w-full flex-1 bg-black">
      <View className="w-full flex-row justify-between items-center p-3">
        <Text className="text-2xl font-semibold text-white">Homepage</Text>
        <TouchableOpacity onPress={handleSignout}>
          <Ionicons name="log-out" color="#fff" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Homepage;
