import express from "express";
import { createWebhookHandler, getWebhookByIdHandler } from "../controllers/webhooks.js";

const router = express.Router();

router.post("/", createWebhookHandler);
router.get("/:id", getWebhookByIdHandler);

export default router;