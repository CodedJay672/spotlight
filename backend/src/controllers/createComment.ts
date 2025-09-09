import { Request, Response } from "express";
import { db } from "../db/config";
import { comments, notifications, posts } from "../db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const createComment = async (req: Request, res: Response) => {
  const userId = req.id;
  const { postId, content } = req.body;

  try {
    // get the post detials if it exists
    const post = await db
      .select({ id: posts.id, authorId: posts.userId })
      .from(posts)
      .where(eq(posts.id, postId));
    if (post.length === 0) {
      res.status(404).json({
        success: false,
        message: "Post not found",
      });
      return;
    }

    const newComment = await db
      .insert(comments)
      .values({
        id: uuidv4(),
        postId,
        userId,
        caption: content,
      })
      .returning();

    // send notification if needed
    if (post[0].authorId !== userId) {
      await db.insert(notifications).values({
        id: uuidv4(),
        authorId: post[0].authorId!,
        userId: userId!,
        type: "comments",
        commentId: newComment[0].id,
        postId,
      });
    }

    res.status(201).json({
      success: true,
      message: "Comment added",
      data: newComment[0],
    });
  } catch (error) {
    throw error;
  }
};
