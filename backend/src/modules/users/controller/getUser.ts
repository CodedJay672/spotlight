import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../../../db/config";
import { users } from "../schema/user";

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const userDetails = await db
      .select()
      .from(users)
      .where(eq(users.id, userId as string));

    // handle case: user not found
    if (!userDetails || !userDetails.length) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "user details found",
      data: userDetails[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};
