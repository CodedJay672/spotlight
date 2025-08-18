import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import { config } from "../lib/config";

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(config.db_url!, { prepare: false });
export const db = drizzle({ client });
