import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

import { config } from "../lib/config";

if (!config.db_url) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(config.db_url!, { prepare: false });

export const db = drizzle({ client, schema });
