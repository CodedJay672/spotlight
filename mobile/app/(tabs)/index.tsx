import PostCard from "@/components/PostCard";
import { getAllPosts } from "@/lib/data/post.data";
import { useAuth, useClerk } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Homepage = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<TPosts[] | null>();
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { getToken } = useAuth();
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

  useEffect(() => {
    (async () => {
      try {
        //display indicator while loading posts
        setLoadingPosts(true);
        const token = await getToken();
        // console.log(token);
        const allPosts = await getAllPosts(token!);
        setPosts(allPosts.data);
      } catch (error: any) {
        Alert.alert(error.message);
        throw error;
      } finally {
        setLoadingPosts(false);
      }
    })();
  }, []);

  // loading indicator for logging out and loading posts
  if (loggingOut || loadingPosts) {
    return (
      <View className="w-full flex-1 flex-col justify-center items-center gap-1 bg-black">
        <ActivityIndicator size="large" color="green" />
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

      <FlatList
        data={posts}
        keyExtractor={(post) => post.id}
        renderItem={(post) => <PostCard post={post.item} />}
        ItemSeparatorComponent={() => <View className="w-full h-5" />}
        ListHeaderComponent={() => (
          <View className="w-full rounded-lg overflow-hidden relative">
            <TextInput
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Seach posts..."
              className="text-base p-3 pl-10 bg-white/15 focus:outline-1 placeholder:text-gray-500"
            />
            <Ionicons
              name="search-outline"
              size={24}
              color="#6b7280"
              className="absolute top-2.5 left-2"
            />
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 flex-col justify-center items-center">
            <Text className="text-2xl font-semibold text-green-700">
              No posts yet!
            </Text>
          </View>
        }
        contentContainerStyle={{
          width: "100%",
          padding: 8,
          marginHorizontal: "auto",
          borderRadius: 24,
        }}
      />
    </View>
  );
};

export default Homepage;
