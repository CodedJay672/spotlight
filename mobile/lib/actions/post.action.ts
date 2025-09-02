export const createPost = async (postInfo: FormData, token: string) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/post/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: postInfo,
      }
    );

    // error handling
    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const togglePostLike = async (postId: string, token: string) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_BASE_URL}/toggle-like/${postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return error.message as string;
    }

    const data = (await response.json()) as TLikeResponse;
    return data.data;
  } catch (error) {
    throw error;
  }
};
