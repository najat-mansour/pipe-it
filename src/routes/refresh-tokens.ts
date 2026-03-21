import express from "express";
import { refreshTokenHandler, revokeTokenHandler } from "../controllers/refresh-tokens.js";
import { usersLimiter } from "../middlewares/rate-limiter.js";

const router = express.Router();

router.use(usersLimiter);
router.post("/refresh", refreshTokenHandler);
router.post("/revoke", revokeTokenHandler);

export default router;