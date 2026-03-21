import express from "express";
import { createWebhookHandler, deleteWebhookByIdHandler, getAllWebhooksByUserIdHandler, getAllWebhooksHandler, getWebhookByIdHandler, updateWebhookHandler } from "../controllers/webhooks.js";
import { webhooksLimiter } from "../middlewares/rate-limiter.js";

const router = express.Router();

router.use(webhooksLimiter);
router.post("/", createWebhookHandler);
router.get("/:id", getWebhookByIdHandler);
router.get("/", getAllWebhooksHandler);
router.get("/user/:userId", getAllWebhooksByUserIdHandler);
router.delete("/:id", deleteWebhookByIdHandler);
router.patch("/:id", updateWebhookHandler);

export default router;