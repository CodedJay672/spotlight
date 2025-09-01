import express, { NextFunction, Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";
import multer from "multer";
import { createPost } from "../controllers/createPost";
import { verifyUser } from "../middleware/verifyUser";
import { getAllPosts } from "../controllers/getAllPosts";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/create",
  checkSchema({
    imgUrl: {
      optional: true,
    },
    caption: {
      optional: true,
      isLength: {
        options: { max: 2000 },
        errorMessage: "caption too long.",
      },
    },
    userId: {
      notEmpty: true,
      errorMessage: "user must have a valid clerk id",
    },
  }),
  (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);

    if (!result.isEmpty()) res.send({ errors: result.array() });

    next();
  },
  upload.single("image"),
  verifyUser,
  createPost
);

router.get("/all-posts", verifyUser, getAllPosts);

export default router;
