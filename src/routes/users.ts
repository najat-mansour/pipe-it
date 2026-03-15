import express from "express";
import { createUserHandler } from "../controllers/users.js";

const router = express.Router();

router.post("/", createUserHandler);

export default router;
