import { Request, Response } from "express";
import { db } from "../db/config";
import { comments, notifications, posts } from "../db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

export const createComment = async (req: Request, res: Response) => {
  const userId = req.id;
  const { content } = req.body;
  const { postId } = req.params;

  try {
    // get the post detials if it exists
    const post = await db
      .select({ id: posts.id, authorId: posts.userId })
      .from(posts)
      .where(eq(posts.id, postId as string));

    //handle case: post not found
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
        postId: postId as string,
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
        postId: postId as string,
      });
    }

    res.status(201).json({
      success: true,
      message: "Comment added",
      data: newComment[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};
