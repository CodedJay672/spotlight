import type { CorsOptions } from "cors";
import { config } from ".";

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (config.node_env === "development" || !origin) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS error: Request from ${origin} is blocked by cors.`)
      );
    }
  },
};

export default corsOptions;
