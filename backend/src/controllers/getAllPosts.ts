import { Request, Response } from "express";
import { db } from "../db/config";
import { assets, likes, posts, users } from "../db/schema";
import { and, eq } from "drizzle-orm";

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const allPosts = await db.select().from(posts).orderBy(posts.createdAt);

    const postsWithDetails = await Promise.all(
      allPosts.map(async (post) => {
        const image = await db
          .select({ imgUrl: assets.thumbnailUrl })
          .from(assets)
          .where(eq(assets.postId, post.id));

        const authorInfo = await db
          .select({
            id: users.id,
            firstname: users.firstName,
            lastname: users.lastName,
            imgUrl: users.imgUrl,
            username: users.userName,
            bio: users.bio,
          })
          .from(users)
          .where(eq(users.id, post.userId));

        const liked = await db
          .select()
          .from(likes)
          .where(and(eq(likes.postId, post.id), eq(likes.userId, req.id!)));

        return {
          ...post,
          author: authorInfo[0],
          imgUrl: image[0].imgUrl,
          liked: liked.length > 0,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: postsWithDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
