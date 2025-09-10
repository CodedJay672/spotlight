import { Request, Response } from "express";
import { db } from "../db/config";
import { likes, notifications, posts } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const toggleLikePost = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "postId is required",
      });
    }

    // confirm if the post exists
    const post = await db
      .select({ id: posts.id, authorId: posts.userId, likes: posts.likesCount })
      .from(posts)
      .where(eq(posts.id, id));

    //handle not found
    if (post.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // check if post is already liked
    const liked = await db
      .select()
      .from(likes)
      .where(and(eq(likes.userId, userId!), eq(likes.postId, id)));

    if (liked.length > 0) {
      await db.delete(likes).where(eq(likes.id, liked?.[0].id));
      // decrease the like count for the post
      if (post)
        await db
          .update(posts)
          .set({ likesCount: post[0].likes! - 1 })
          .where(eq(posts.id, id));

      return res.status(200).json({
        success: true,
        message: "unliked",
        data: false,
      });
    }

    await db.insert(likes).values({
      id: uuidv4(),
      postId: id,
      userId,
    });

    //increment the post like count
    if (post)
      await db
        .update(posts)
        .set({ likesCount: post[0].likes! + 1 })
        .where(eq(posts.id, id));

    //send out notification
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
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
