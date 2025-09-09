import { NextFunction, Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";
import multer from "multer";
import { createPost } from "../controllers/createPost";
import { getAllPosts } from "../controllers/getAllPosts";
import { toggleLikePost } from "../controllers/toggleLikePosts";
import { verifyUser } from "../middleware/verifyUser";

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
  }),
  (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      res.send({ errors: result.array() });
      return;
    }

    next();
  },
  upload.single("image"),
  verifyUser,
  createPost
);

router.get("/all-posts", verifyUser, getAllPosts);
router.post("/toggle-like/:id", verifyUser, toggleLikePost);

export default router;
