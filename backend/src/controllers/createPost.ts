import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../db/storage";
import { db } from "../db/config";
import { assets, posts } from "../db/schema";
import { eq } from "drizzle-orm";

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

      const { error } = await supabase.storage
        .from("spotlight-assets")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (error) {
        //delete the post if the image failed to upload
        await db.delete(posts).where(eq(posts.id, newPost[0].id));
        throw error;
      }

      const { data: publicUrl } = supabase.storage
        .from("spotlight-assets")
        .getPublicUrl(fileName);

      imgFromStorage = publicUrl.publicUrl;
      await db.insert(assets).values({
        id: uuidv4(),
        postId: newPost[0].id,
        thumbnailUrl: imgFromStorage,
      });
    }

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: newPost[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
