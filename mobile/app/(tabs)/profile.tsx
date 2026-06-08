import { View, Text, ScrollView } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

const Profile = () => {
  return (
    <View className="flex-1 bg-black space-y-6">
      <View className="w-full p-2 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-white">Profile</Text>
        <Ionicons name="ellipsis-vertical" size={24} color="gray" />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          width: "auto",
          height: "auto",
          backgroundColor: "#000",
          padding: 8,
        }}
      ></ScrollView>
    </View>
  );
};

export default Profile;
