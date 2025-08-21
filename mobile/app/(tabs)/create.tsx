import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

const Create = () => {
  const { user } = useUser();
  const router = useRouter();
  const [isSharing, setIsSharing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>("");

  const handleSelectImage = useCallback(async () => {
    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!image.canceled) setSelectedImage(image.assets[0].uri);
  }, [selectedImage]);

  if (!selectedImage) {
    return (
      <View className="flex-1 bg-black">
        <View className="w-full py-4 px-2 flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="size-11 flex items-center justify-center"
          >
            <Ionicons name="arrow-back" color="green" size={24} />
          </TouchableOpacity>
          <View className="w-full flex-row justify-center items-center gap-14">
            <Text className="text-xl text-gray-100 font-semibold">
              Select image
            </Text>
            <View className="size-7" />
          </View>
        </View>
        <TouchableOpacity
          onPress={handleSelectImage}
          className="w-full h-full justify-center items-center gap-1 bg-gray-950"
        >
          <Ionicons name="image-outline" size={64} color="gray" />
          <View className="w-full">
            <Text className="text-base text-center text-gray-600">
              Tap to choose an image
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      className="flex-1 bg-black"
    >
      <View className="w-full h-16 flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => setSelectedImage(null)}
          className="w-16 justify-center items-center"
        >
          <Ionicons name="close" size={20} color="white" />
        </TouchableOpacity>

        <View className="justify-center items-center">
          <Text className="text-xl text-white font-semibold">New post</Text>
        </View>

        <TouchableOpacity
          disabled={isSharing || !selectedImage}
          onPress={() => setIsSharing((prev) => !prev)}
          className="w-16 justify-center items-center"
        >
          {isSharing ? (
            <ActivityIndicator size={20} color="gray" />
          ) : (
            <Text className="text-base text-green-600 font-semibold align-middle">
              Share
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          width: "100%",
          height: "100%",
        }}
      >
        <View className="w-full h-96 relative">
          <Image
            source={selectedImage}
            accessibilityLabel="selected image"
            alt="selected image"
            contentFit="cover"
            transition={1000}
            style={{ width: "100%", height: "100%" }}
          />
          <TouchableOpacity
            onPress={handleSelectImage}
            className="px-3 py-2 bg-gray-900 rounded-full absolute right-2 bottom-2"
          >
            <View className="justify-center items-center gap-1 flex-row">
              <Ionicons name="image-outline" size={16} color="white" />
              <Text className="text-gray-50">Change</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Create;

const styles = StyleSheet.create({});
