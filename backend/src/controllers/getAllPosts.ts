import { Request, Response } from "express";
import { db } from "../db/config";
import { assets, likes, posts, users } from "../db/schema";
import { and, eq } from "drizzle-orm";

export const getAllPosts = async (req: Request, res: Response) => {
  const userId = req.id;

  try {
    const allPosts = await db
      .select({
        id: posts.id,
        content: posts.caption,
        isLiked: {
          id: likes.id,
          postId: likes.postId,
          userId: likes.userId,
        },
        author: {
          id: users.id,
          firstName: users.firstName,
          lastname: users.lastName,
          bio: users.bio,
          profileImg: users.imgUrl,
        },
        assets: {
          id: assets.id,
          imgUrl: assets.thumbnailUrl,
        },
        createdAt: posts.createdAt,
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .leftJoin(
        likes,
        and(eq(posts.id, likes.postId), eq(likes.userId, userId!))
      )
      .leftJoin(assets, eq(assets.postId, posts.id));

    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: allPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
