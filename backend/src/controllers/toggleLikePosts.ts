import { Request, Response } from "express";
import { db } from "../db/config";
import { likes, notifications, posts } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const toggleLikePost = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const { id } = req.params;

    // confirm if the post exists
    const post = await db
      .select({ id: posts.id, authorId: posts.userId })
      .from(posts)
      .where(eq(posts.id, id));
    if (post.length === 0) {
      res.status(404).json({
        success: false,
        message: "Post not found",
      });
      return;
    }

    // check if post is already liked
    const liked = await db
      .select()
      .from(likes)
      .where(and(eq(likes.userId, userId!), eq(likes.postId, id)));

    if (liked.length > 0) {
      await db.delete(likes).where(eq(likes.id, liked?.[0].id));

      res.status(200).json({
        success: true,
        message: "unliked",
        data: false,
      });
      return;
    }

    await db.insert(likes).values({
      id: uuidv4(),
      postId: id,
      userId,
    });

    if (post?.[0].authorId !== userId) {
      await db.insert(notifications).values({
        id: uuidv4(),
        authorId: post[0].authorId!,
        userId: userId!,
        type: "likes",
      });
    }
    res.status(201).json({
      success: true,
      message: "liked",
      data: true,
    });
  } catch (error) {
    throw error;
  }
};
