import { NextFunction, Request, Response } from "express";
import { db } from "../db/config";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { getAuth } from "@clerk/express";

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
  try {
    // get the user with the clerk id
    const { userId } = getAuth(req);

    if (!userId)
      res.status(403).json({
        status: false,
        message: "Unauthorized",
      });

    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, userId!))
      .limit(1);

    if (user.length === 0)
      res.status(404).json({
        success: false,
        message: "user not found.",
      });

    req.id = user?.[0].id;
    next();
  } catch (error) {
    throw error;
  }
}
