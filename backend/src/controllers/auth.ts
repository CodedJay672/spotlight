import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { UserJSON } from "@clerk/express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { v4 as uuidv4 } from "uuid";

import { db } from "../db/config";
import { users } from "../db/schema";
import { config } from "../lib/config";

export const createNewUser = async (req: Request, res: Response) => {
  try {
    const evt = await verifyWebhook(req);

    if (!evt) res.status(500).send("Error verifying webhook");

    const {
      id,
      email_addresses,
      first_name,
      last_name,
      image_url,
      phone_numbers,
      username,
    } = evt.data as UserJSON;

    // check if the user already exists
    const isCreated = await db
      .select({ id: users.id, clerkId: users.clerkId })
      .from(users)
      .where(eq(users.clerkId, id));
    if (isCreated.length > 0) return;

    // create the row in the DB
    const user = await db
      .insert(users)
      .values({
        id: uuidv4(),
        clerkId: id,
        firstName: first_name ?? "John",
        lastName: last_name ?? "Doe",
        email: "test@email.com",
        phone: "12346789012",
        userName: "John Doe",
        imgUrl: image_url ?? "testimage.com",
        displayName: first_name ?? "John",
      })
      .returning();

    // see the created user record
    if (config.node_env === "development") console.log(user);

    return res.status(201).json({ message: "Sign in success." });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return res.status(400).send("Error verifying webhook");
  }
};
