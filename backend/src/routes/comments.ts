import { NextFunction, Request, Response, Router } from "express";
import { createComment } from "../controllers/createComment";
import { checkSchema, validationResult } from "express-validator";
import { verifyUser } from "../middleware/verifyUser";
import { getComments } from "../controllers/allComment";

const router = Router();

router.get("/:postId", verifyUser, getComments);

router.post(
  "/add-comment/:postId",
  checkSchema({
    postId: {
      isUUID: true,
      errorMessage: "Invalid post ID",
    },
    content: {
      isString: true,
      errorMessage: "Your comment should be texts",
    },
  }),
  (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      res.send({ error: result.array() });
      return;
    }

    next();
  },
  verifyUser,
  createComment
);

export default router;
