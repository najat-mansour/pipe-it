import express from "express";
import { refreshTokenHandler, revokeTokenHandler } from "../controllers/refresh-tokens.js";

const router = express.Router();

router.post("/refresh", refreshTokenHandler);
router.post("/revoke", revokeTokenHandler);

export default router;