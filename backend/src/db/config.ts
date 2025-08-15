import postgres from "postgres";
import { drizzle } from "drizzle-orm/node-postgres";

import { config } from "../lib/config";

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(config.db_url!, { prepare: false });
export const db = drizzle(client);
