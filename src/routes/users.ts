import express from "express";
import { createUserHandler, deleteUserHandler, getAllUsersHandler, getUserByIdHandler, loginHandler } from "../controllers/users.js";

const router = express.Router();

router.post("/", createUserHandler);
router.post("/auth", loginHandler);
router.get("/:id", getUserByIdHandler);
router.get("/", getAllUsersHandler);
router.delete("/", deleteUserHandler);

export default router;
