import express from "express";

import { createNewUser } from "../controllers/auth";

//create the router
const router = express.Router();

router.post(
  "/clerk-webhook",
  express.raw({ type: "application/json" }),
  createNewUser
);

export default router;
