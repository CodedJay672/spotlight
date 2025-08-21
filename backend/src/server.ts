import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import { clerkMiddleware } from "@clerk/express";

//custom module
import { config } from "./lib/config/index";
import corsOptions from "./lib/config/corsconfig";
import limiter from "./lib/config/ratelimiterconfig";

//routes
import authRouter from "./routes/webhook";

// initialize the app
const app = express();

//load useful middleware
app.use(cors(corsOptions));
app.use(express.urlencoded());
app.use(helmet());
app.use(cookieParser());
app.use(compression({ threshold: 1024 }));
app.use(clerkMiddleware());
app.use(limiter);

// api endpoints
app.use("/api/auth", authRouter);

app.listen(config.port, () => {
  console.log("server is running on port", config.port);
});
