import express from "express";
import {
  createUserHandler,
  deleteUserHandler,
  forgetPasswordHandler,
  getAllUsersHandler,
  getUserByIdHandler,
  loginHandler,
  updateUserHandler,
} from "../controllers/users.js";
import { usersLimiter } from "../middlewares/rate-limiter.js";

const router = express.Router();

router.use(usersLimiter);
router.post("/", createUserHandler);
router.post("/auth", loginHandler);
router.get("/:id", getUserByIdHandler);
router.get("/", getAllUsersHandler);
router.delete("/", deleteUserHandler);
router.patch("/", updateUserHandler);
router.post("/forget-password", forgetPasswordHandler);

export default router;
