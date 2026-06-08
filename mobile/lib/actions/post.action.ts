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
      },
    );

    // error handling
    if (!response.ok) {
      let message = response.statusText;
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) message = errorData.message;
      } catch (_) {}
      return {
        success: false,
        message,
      };
    }

    const data = await response.json();
    return {
      success: true,
      post: data,
    };
  } catch (error) {
    throw error;
  }
};

export const togglePostLike = async (postId: string, token: string) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/post/toggle-like/${postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      let message = response.statusText;
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) message = errorData.message;
      } catch (_) {}
      throw { message } as Error;
    }

    const data = (await response.json()) as TLikeResponse;
    return data.data;
  } catch (error) {
    throw error;
  }
};
