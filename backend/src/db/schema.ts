import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  uuid,
  varchar,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").unique(),
  phone: varchar("phone", { length: 20 }),
  userName: varchar("username", { length: 50 }).unique().notNull(),
  displayName: varchar("display_name", { length: 150 }),
  bio: text("bio"),
  imgUrl: text("imgUrl"),
  location: text("location"),
  isPrivate: boolean("is_private"),
  isVerified: boolean("is_verified"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
}).enableRLS();

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey(),
  userId: uuid("creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  caption: text("caption"),
  allowComments: boolean("allow_comments"),
  likesCount: integer("likes_count"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
}).enableRLS();

export const assets = pgTable("assets", {
  id: uuid("id").primaryKey(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  thumbnailUrl: text("thumbnail_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}).enableRLS();

export const likes = pgTable("likes", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}).enableRLS();

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
  caption: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updtedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
}).enableRLS();

export const follows = pgTable("follows", {
  id: uuid("id").primaryKey(),
  follows: uuid("followed_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  followers: uuid("follower_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}).enableRLS();

export const blocks = pgTable("blocks", {
  id: uuid("id").primaryKey(),
  blockerId: uuid("blocker_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  blockedId: uuid("blocked_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  reason: text("reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}).enableRLS();

export const mutes = pgTable("mutes", {
  id: uuid("id").primaryKey(),
  muterId: uuid("muter_id").references(() => users.id, { onDelete: "cascade" }),
  mutedId: uuid("muted_id").references(() => users.id, { onDelete: "cascade" }),
  duration: timestamp("reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}).enableRLS();

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  authorId: uuid("author-id").references(() => users.id, {
    onDelete: "cascade",
  }),
  type: uuid("type")
    .references(() => follows.id, { onDelete: "cascade" })
    .references(() => comments.id, { onDelete: "cascade" })
    .references(() => likes.id, { onDelete: "cascade" }),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
  commentId: uuid("comment_id").references(() => comments.id, {
    onDelete: "cascade",
  }),
}).enableRLS();

//=============== Relationships
export const userRelation = relations(users, ({ many }) => ({
  posts: many(posts),
  follows: many(follows),
}));

export const followsRelation = relations(follows, ({ one }) => ({
  users: one(users, {
    fields: [follows.followers],
    references: [users.id],
  }),
}));

export const postRelation = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  assets: many(assets),
  comments: many(comments),
}));

export const assetsRelation = relations(assets, ({ one }) => ({
  posts: one(posts, {
    fields: [assets.postId],
    references: [posts.id],
  }),
}));

export const commentsRelation = relations(comments, ({ one }) => ({
  posts: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));
