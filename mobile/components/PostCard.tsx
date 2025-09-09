import { togglePostLike } from "@/lib/actions/post.action";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

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
            <View className="rounded-full overflow-hidden">
              <Image
                source={{ uri: post.author.imgUrl as string }}
                width={32}
                height={32}
                resizeMode="contain"
              />
            </View>
            <View className="ml-2">
              <Text className="text-base text-gray-50 font-semibold">
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
            <TouchableOpacity
              disabled={isLiking}
              onPress={handleLikePost}
              className="p-2"
            >
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={20}
                color={liked ? "green" : "#fff"}
              />
            </TouchableOpacity>

            <Ionicons name="chatbubble-outline" size={20} color="#fff" />
          </View>

          <Ionicons name="bookmark-outline" size={20} color="#fff" />
        </View>
      </View>

      <View className="w-full mt-1">
        {!liked && (
          <Text className="text-xs text-gray-500">
            Be the first to like this post
          </Text>
        )}
      </View>
    </View>
  );
};

export default PostCard;
