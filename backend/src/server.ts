import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";

//custom module
import { config } from "./lib/config/index";
import corsOptions from "./lib/config/corsconfig";
import limiter from "./lib/config/ratelimiterconfig";

//routes
import router from "./routes/index";

// initialize the app
const app = express();

//load useful middleware
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());
app.use(compression({ threshold: 1024 }));

//rate limiting middleware
app.use(limiter);

(async () => {
  try {
    app.use("/api", router);

    app.listen(config.port, () => {
      console.log("server is running on port", config.port);
    });
  } catch (error) {
    console.log("Failed to start server");
    if (config.node_env === "production") process.exit(1);
  }
})();
