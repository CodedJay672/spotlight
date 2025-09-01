import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createPost } from "@/lib/actions/post.action";

const Create = () => {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isSharing, setIsSharing] = useState(false);
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>("");

  // select the image
  const handleSelectImage = useCallback(async () => {
    //get image library permission
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Spotlight needs permission to access your library");
      return;
    }

    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!image.canceled) setSelectedImage(image.assets[0].uri);
  }, [selectedImage]);

  const handleCreatePost = async () => {
    // veify the signed in user
    if (!isSignedIn) router.replace("/(auth)/login");

    //create the formdata for the post content and image
    let formData = new FormData();
    formData.append("caption", content);
    formData.append("userId", user?.id ?? "");

    if (selectedImage) {
      const filename = selectedImage.split("/").pop() || "photo.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("image", {
        uri: selectedImage,
        name: filename,
        type,
      } as any);
    }
    try {
      //loading state
      setIsSharing(true);

      const token = await getToken();

      //begin the product creation
      const newPost = await createPost(formData, token!);

      if (!newPost) {
        Alert.alert("Failed.");
        return;
      }

      setContent("");
      setSelectedImage("");
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Failed to create post.", error.message);
    } finally {
      setIsSharing(false);
    }
  };

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
          onPress={handleCreatePost}
          className="w-16 justify-center items-center"
        >
          {isSharing ? (
            <ActivityIndicator size={20} color="gray" />
          ) : (
            <Text className="text-base text-green-700 font-bold align-middle">
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
            disabled={isSharing}
            className="px-3 py-2 bg-gray-900 rounded-full absolute right-2 bottom-2"
          >
            <View className="justify-center items-center gap-1 flex-row">
              <Ionicons name="image-outline" size={16} color="white" />
              <Text className="text-gray-50">Change</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="flex flex-row gap-4 mt-4 p-2">
          <View className="size-14 rounded-full flex justify-center items-center">
            <Image
              source={user?.imageUrl}
              alt={user?.fullName ?? "user"}
              transition={100}
              contentFit="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <TextInput
            value={content}
            onChangeText={setContent}
            keyboardType="default"
            placeholder="What is happening?"
            placeholderTextColor="#6b7280"
            editable={!isSharing}
            multiline
            className="flex-1 bg-gray-900 text-gray-50 p-2 px-5 rounded-lg"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Create;
