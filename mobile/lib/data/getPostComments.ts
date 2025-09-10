export const getPostComments = async (postId: string, token: string) => {
  try {
    const comments = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/comments/${postId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    //error handling
    if (!comments.ok) {
      const error = await comments.json();
      throw new Error(error);
    }

    const data = (await comments.json()) as TGetComment;
    return {
      status: comments.status,
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    throw error;
  }
};
