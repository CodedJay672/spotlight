export const createPost = async (postInfo: FormData) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/post/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
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
