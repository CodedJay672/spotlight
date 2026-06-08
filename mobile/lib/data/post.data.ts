export const getAllPosts = async (token: string): Promise<TPostsResponse> => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/post/all-posts`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
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
      return {
        status: response.status,
        success: false,
        message,
        data: [],
      };
    }

    const data = (await response.json()) as TPostsResponse;

    return data;
  } catch (error) {
    throw error;
  }
};
