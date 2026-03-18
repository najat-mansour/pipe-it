import express from "express";
import { createWebhookHandler, deleteWebhookByIdHandler, getAllWebhooksByUserIdHandler, getAllWebhooksHandler, getWebhookByIdHandler } from "../controllers/webhooks.js";

const router = express.Router();

router.post("/", createWebhookHandler);
router.get("/:id", getWebhookByIdHandler);
router.get("/", getAllWebhooksHandler);
router.get("/user/:userId", getAllWebhooksByUserIdHandler);
router.delete("/:id", deleteWebhookByIdHandler);


export default router;