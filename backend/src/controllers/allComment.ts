import { Request, Response } from "express";
import { db } from "../db/config";
import { comments, users } from "../db/schema";
import { eq } from "drizzle-orm";

export const getComments = async (req: Request, res: Response) => {
  const { postId } = req.params;

  if (!postId) {
    return res.status(400).json({
      success: false,
      message: "postId is required",
    });
  }

  try {
    // join response of comments with the author information
    const commentWithInfo = await db
      .select({
        id: comments.id,
        userId: comments.userId,
        postId: comments.postId,
        content: comments.caption,
        createdAt: comments.createdAt,
        author: {
          id: users.id,
          userName: users.userName,
          imgUrl: users.imgUrl,
        },
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postId, postId));

    res.status(200).json({
      success: true,
      message: "comments fetched successfully",
      data: commentWithInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
