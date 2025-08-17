import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export const config = {
  port: process.env.PORT!,
  node_env: process.env.NODE_ENV,
  db_url: process.env.DATABASE_URL,
  clerk_pub_key: process.env.CLERK_PUBLISHABLE_KEY,
  clerk_secret: process.env.CLERK_SECRET_KEY,
  clerk_wh_secret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
};
