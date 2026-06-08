import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export const config = {
  port: process.env.PORT!,
  node_env: process.env.NODE_ENV!,
  db_url: process.env.DATABASE_URL!,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY!,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET!,
  clerk_pub_key: process.env.CLERK_PUBLISHABLE_KEY!,
  clerk_secret: process.env.CLERK_SECRET_KEY!,
  clerk_wh_secret: process.env.CLERK_WEBHOOK_SIGNING_SECRET!,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET!,
};
