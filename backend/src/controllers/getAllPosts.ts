import { Request, Response } from "express";
import { db } from "../db/config";

export const getAllPosts = async (req: Request, res: Response) => {
  const userId = req.id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const allPosts = await db.query.posts.findMany({
      with: {
        user: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            bio: true,
            imgUrl: true,
          },
        },
        assets: {
          columns: {
            id: true,
            thumbnailUrl: true,
          },
        },
        comments: {
          with: {
            user: {
              columns: {
                id: true,
                firstName: true,
                lastName: true,
                bio: true,
                imgUrl: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(allPosts);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};
