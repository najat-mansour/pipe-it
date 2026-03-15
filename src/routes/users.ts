import express from "express";
import { createUserHandler, loginHandler } from "../controllers/users.js";

const router = express.Router();

router.post("/", createUserHandler);
router.post("/auth", loginHandler);

export default router;
