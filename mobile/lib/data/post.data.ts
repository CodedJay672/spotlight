export const getAllPosts = async (token: string) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/post/all-posts`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    const data = (await response.json()) as TPostsResponse;
    return data;
  } catch (error) {
    throw error;
  }
};
