import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db/config";
import { assets, posts } from "../db/schema";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { caption } = req.body;
    let imgFromStorage = null;

    // upload the post
    const newPost = await db
      .insert(posts)
      .values({
        id: uuidv4(),
        userId: req.id ?? "",
        allowComments: true,
        caption,
        likesCount: 0,
      })
      .returning();

    //upload the image if it is available
    if (req.file) {
      const fileExt = req.file.originalname.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      // upload the image to cloudinary
      const { v2: cloudinary } = await import("cloudinary");
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        public_id: `posts/${fileName}`,
        folder: "posts",
      });

      imgFromStorage = uploadResult.secure_url;

      // save the image url to the database
      await db.insert(assets).values({
        id: uuidv4(),
        postId: newPost[0].id,
        thumbnailUrl: imgFromStorage,
      });
    }
    res.status(201).json(newPost[0]);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
