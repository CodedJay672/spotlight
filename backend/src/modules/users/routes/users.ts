import { Router } from "express";
import { verifyUser } from "../../../middleware/verifyUser";
import { getUserById } from "../controller/getUser";

const router = Router();

router.get("/:userId", verifyUser, getUserById);

export default router;
