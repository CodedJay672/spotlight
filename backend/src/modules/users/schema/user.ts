import { type InferSelectModel, relations } from "drizzle-orm";
import {
  pgTable,
  text,
  uuid,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { follows, posts } from "../../../db/schema";
import { InferInsertModel } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").unique(),
  clerkId: text("clerk_id").unique(),
  phone: varchar("phone", { length: 20 }),
  userName: varchar("username", { length: 50 }).unique(),
  displayName: varchar("display_name", { length: 150 }),
  bio: text("bio"),
  imgUrl: text("imgUrl"),
  location: text("location"),
  isPrivate: boolean("is_private").default(false),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
}).enableRLS();

// Define relations
export const userRelation = relations(users, ({ many }) => ({
  posts: many(posts),
  follows: many(follows),
}));

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
