import { createClient } from "@supabase/supabase-js";

import { config } from "../lib/config";

export const supabase = createClient(config.project_url!, config.api_secret!);
