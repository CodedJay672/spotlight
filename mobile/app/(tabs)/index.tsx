import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useAuth, useClerk } from "@clerk/clerk-expo";
import { getAllPosts } from "@/lib/data/post.data";
import { togglePostLike } from "@/lib/actions/post.action";

const PostCard = ({ post }: { post: TPosts }) => {
  const { getToken } = useAuth();
  const [liked, setliked] = useState(post.liked);
  const [isLiking, setIsLiking] = useState(false);

  const handleLikePost = async () => {
    try {
      //loading state
      setIsLiking(true);

      //get the clerk JWT
      const token = await getToken();

      //start the like process
      const liked = await togglePostLike(post.id, token!);
      if (typeof liked === "string") {
        Alert.alert(liked);
        return;
      }

      setliked(liked);
    } catch (error: any) {
      Alert.alert(error.message);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <View className="w-full space-y-1 rounded-lg">
      <View className="w-full p-3 flex-row justify-between items-center">
        <Link href={`/profile`} asChild>
          <TouchableOpacity className="flex-row items-center gap-1">
            <View className="size-12 rounded-full overflow-hidden">
              <Image
                source={{ uri: post.author.imgUrl as string }}
                width={48}
                height={48}
                resizeMode="contain"
              />
            </View>
            <View className="ml-2">
              <Text className="text-base text-white font-bold">
                {post.author.firstname} {post.author.lastname}
              </Text>
              <Text className="text-base text-gray-500 font-semibold truncate text-ellipsis">
                {post.author.bio ?? "No bio"}
              </Text>
            </View>
          </TouchableOpacity>
        </Link>

        <Ionicons name="ellipsis-horizontal" size={16} color="#6b7280" />
      </View>

      <View className="w-full">
        <View className="w-xs h-96 overflow-hidden rounded-lg">
          <Image
            source={{
              uri: post.imgUrl,
            }}
            alt={post.caption ?? "special post"}
            width={96}
            height={96}
            resizeMode="cover"
          />
        </View>
        <View className="w-full flex-row justify-between gap-2">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity disabled={isLiking} onPress={handleLikePost}>
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={30}
                color="#fff"
              />
            </TouchableOpacity>

            <Ionicons name="chatbubble-outline" size={28} color="#fff" />
          </View>

          <Ionicons name="bookmark-outline" size={30} color="#fff" />
        </View>
      </View>
    </View>
  );
};

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
        ItemSeparatorComponent={() => <View className="w-full h-3" />}
        ListHeaderComponent={() => (
          <View className="w-full rounded-lg overflow-hidden relative">
            <TextInput
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Seach posts..."
              className="text-base p-3 pl-10 bg-white/10 focus:outline-1 placeholder:text-gray-500"
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
        // refreshControl={<ActivityIndicator size={32} color="#15803d" />}
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
