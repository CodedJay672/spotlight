import { NextFunction, Request, Response } from "express";
import { db } from "../db/config";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

declare module "express-serve-static-core" {
  interface Request {
    id?: string;
  }
}

export async function verifyUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.body;

  try {
    // get the user with the clerk id
    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (user.length === 0)
      res.status(404).json({
        success: false,
        message: "user not found.",
      });
    req.id = user[0].id;
    next();
  } catch (error) {
    throw error;
  }
}
