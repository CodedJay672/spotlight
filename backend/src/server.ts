import { clerkMiddleware } from "@clerk/express";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

//custom module
import corsOptions from "./lib/config/corsconfig";
import { config } from "./lib/config/index";
import limiter from "./lib/config/ratelimiterconfig";

//routes
import postRouter from "./routes/post";
import authRouter from "./routes/webhook";

// initialize the app
const app = express();

//load useful middleware
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());
app.use(clerkMiddleware());
app.use(compression({ threshold: 1024 }));
app.use(express.json());
app.use(limiter);

// api endpoints
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);

app.listen(config.port, () => {
  console.log("server is running on port", config.port);
});
