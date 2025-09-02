import { Request, Response } from "express";
import { db } from "../db/config";
import { likes } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const toggleLikePost = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const { id } = req.params;

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
    }

    await db.insert(likes).values({
      id: uuidv4(),
      postId: id,
      userId,
    });
    res.status(201).json({
      success: true,
      message: "liked",
      data: true,
    });
  } catch (error) {
    throw error;
  }
};
