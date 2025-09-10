export const addComment = async (
  postId: string,
  content: string,
  token: string
) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/comments/add-comment/${postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      }
    );

    // error handling
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = (await response.json()) as TAddCommentResponse;
    return {
      status: response.status,
      message: "comment added",
      data: data.data,
    };
  } catch (error) {
    throw error;
  }
};
