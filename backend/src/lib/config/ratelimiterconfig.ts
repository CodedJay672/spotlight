import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60000,
  limit: 60,
  statusCode: 400,
  message: { error: "Too many request. Please try again later." },
  legacyHeaders: false,
  standardHeaders: "draft-8",
  validate: { xForwardedForHeader: false },
});

export default limiter;
