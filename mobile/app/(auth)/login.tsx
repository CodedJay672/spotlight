import React from "react";
import { Pressable, Text, View } from "react-native";

const SignIn = () => {
  return (
    <View className="w-full flex-1 flex justify-center items-center bg-black relative">
      <View className="w-full space-y-1">
        <Text className="text-2xl text-green-600 font-semibold tracking-widest text-center">
          spotlight
        </Text>
        <Text className="text-sm text-green-700 text-center">
          sign in to continue
        </Text>
      </View>

      <Pressable className="w-2/3 mx-auto bg-black border border-green-500 rounded-full p-2 absolute bottom-10 left-auto">
        <Text className="text-base text-green-700 font-bold text-center">
          Continue with google
        </Text>
      </Pressable>
    </View>
  );
};

export default SignIn;
