import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export const config = {
  port: process.env.PORT!,
  node_env: process.env.NODE_ENV,
  db_url: process.env.DATABASE_URL,
};
