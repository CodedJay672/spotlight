import { togglePostLike } from "@/lib/actions/post.action";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import Comments from "./Comments";

const PostCard = ({ post }: { post: TPosts }) => {
  const { getToken } = useAuth();
  const [liked, setliked] = useState(!!post.isLiked);
  const [isLiking, setIsLiking] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleLikePost = async () => {
    try {
      //loading state
      setIsLiking(true);

      //get the clerk JWT
      const token = await getToken();
      if (!token) return;

      //start the like process
      const liked = await togglePostLike(post.id, token);
      setliked(liked);
    } catch (error) {
      Alert.alert(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <View className="w-full space-y-1 rounded-lg">
      <View className="w-full flex-row justify-between items-center">
        <Link href={`/profile`} asChild>
          <TouchableOpacity className="flex-row items-center gap-1">
            <View className="rounded-full overflow-hidden">
              <Image
                source={{ uri: post.author.profileImg as string }}
                style={{ width: 32, height: 32 }}
                resizeMode="contain"
              />
            </View>
            <View className="ml-2">
              <Text className="text-base text-gray-50 font-semibold">
                {post.author.firstName} {post.author.lastname}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="text-base text-gray-500 font-semibold"
              >
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
              uri: post.assets.imgUrl,
            }}
            accessibilityLabel={post.assets.id ?? "special post"}
            style={{ width: "100%", height: 384 }}
            resizeMode="cover"
          />
        </View>
        <View className="w-full flex-row justify-between gap-2">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              disabled={isLiking}
              onPress={handleLikePost}
              className="p-2 flex-row items-center gap-2"
            >
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={24}
                color={liked ? "green" : "#fff"}
              />
              {post.likesCount && post.likesCount > 0 && (
                <Text className="text-base text-white">{post.likesCount}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowModal(true)}>
              <Ionicons name="chatbubble-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <Ionicons name="bookmark-outline" size={20} color="#fff" />
        </View>
      </View>

      <View className="w-full mb-2">
        <Text className="text-base text-white font-medium">{post.content}</Text>
      </View>

      {!liked && (
        <View className="w-full">
          <Text className="text-sm text-gray-500">
            Be the first to like this post
          </Text>
        </View>
      )}

      <Comments
        showModal={showModal}
        setShowModal={setShowModal}
        postId={post.id}
      />
    </View>
  );
};

export default PostCard;
