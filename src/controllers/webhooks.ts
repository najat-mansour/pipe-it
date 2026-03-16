import { Request, Response, NextFunction } from "express";
import { getBearerToken, validateJWT } from "../utils/jwt.js";
import { apiConfig } from "../config.js";
import { createWebhook, getWebhookById } from "../services/webhooks.js";

export async function createWebhookHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const token = getBearerToken(req);
        const userId = validateJWT(token, apiConfig.jwtConfig.secretKey);
        const webhook = req.body;
        const result = await createWebhook(userId, webhook);
        res.status(201).json(result);

    } catch(err: unknown) {
        next(err);

    }
}

export async function getWebhookByIdHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const webhookId = req.params.id as string;
        const webhook = await getWebhookById(webhookId);
        res.status(200).json(webhook);

    } catch(err: unknown) {
        next(err);

    }
}