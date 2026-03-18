import express from "express";
import { createWebhookHandler, getAllWebhooksHandler, getWebhookByIdHandler } from "../controllers/webhooks.js";

const router = express.Router();

router.post("/", createWebhookHandler);
router.get("/:id", getWebhookByIdHandler);
router.get("/", getAllWebhooksHandler);

export default router;