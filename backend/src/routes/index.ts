import express from "express";

//types
import type { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello world, again!" });
});

export default router;
