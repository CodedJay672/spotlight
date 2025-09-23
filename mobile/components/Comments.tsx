import { addComment } from "@/lib/actions/comments.actions";
import { getPostComments } from "@/lib/data/getPostComments";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import React, { Dispatch, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface Props {
  showModal: boolean;
  setShowModal: Dispatch<boolean>;
  postId: string;
}

const Comments = ({ showModal, setShowModal, postId }: Props) => {
  const { getToken } = useAuth();
  const [sending, setSending] = useState(false);

  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState<TCommentWithDetails[]>([]);

  const fetchComments = useCallback(async () => {
    try {
      // Clerk JWT
      const token = await getToken();
      if (!token) return;

      // start fetching comments
      const comments = await getPostComments(postId, token);
      if (comments.status !== 200 || !comments.data) {
        Alert.alert(comments.message);
        return;
      }

      setAllComments(comments.data);
    } catch (error) {
      Alert.alert(error instanceof Error ? error.message : String(error));
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async () => {
    if (!postId || !comment.trim()) return;

    try {
      setSending(true);

      //get the JWT
      const token = await getToken();
      const commented = await addComment(postId, comment, token!);

      if (commented.status !== 201) {
        Alert.alert(commented.message);
        return;
      }

      setComment("");
    } catch (error) {
      throw error;
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      visible={showModal}
      onRequestClose={() => setShowModal(false)}
      backdropColor="#000"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
        className="w-full bg-black flex-1"
      >
        <View className="flex-1 pt-6">
          <View className="w-full flex-row justify-between items-center">
            <Text className="text-white text-2xl font-semibold">Comments</Text>
            <TouchableWithoutFeedback
              onPress={() => setShowModal(false)}
              className="p-2"
            >
              <Ionicons name="close-outline" size={24} color="#fff" />
            </TouchableWithoutFeedback>
          </View>

          <FlatList
            data={allComments}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View className="w-full h-8" />}
            renderItem={({ item }) => (
              <View className="space-y-2">
                <View className="w-full flex-row items-center gap-2">
                  <Image
                    source={{ uri: item.author.imgUrl }}
                    accessibilityLabel={item.author.username ?? "user image"}
                    style={{ width: 32, height: 32 }}
                    className="object-cover rounded-full"
                  />
                  <Text className="flex-1 text-sm text-gray-400">
                    {item.author.username ?? "@username"}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {formatDistanceToNow(item.createdAt)}
                  </Text>
                </View>
                <View className="w-full p-2">
                  <Text className="text-sm text-gray-50 font-light">
                    {item.content}
                  </Text>
                </View>
              </View>
            )}
            ListEmptyComponent={() => (
              <View className="flex-1 mt-20 justify-center items-center">
                <Text className="text-lg text-gray-600">No comments yet</Text>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: 10,
            }}
          />
        </View>
        <View className="w-full flex-row justify-between items-center gap-3 z-10">
          <TextInput
            value={comment}
            onChangeText={setComment}
            keyboardType="twitter"
            placeholder="Comment..."
            placeholderTextColor="#6b7280"
            multiline
            className="flex-1 p-3 bg-white/10 text-gray-50 rounded-lg"
          />
          <TouchableOpacity
            disabled={sending}
            onPress={handleAddComment}
            className="p-2 flex justify-center items-center"
          >
            {sending ? (
              <ActivityIndicator size={26} color="#fff" />
            ) : (
              <Text className="text-base text-green-700">Post</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default Comments;
