import { Request, Response, NextFunction } from "express";
import { getBearerToken, validateJWT } from "../utils/jwt.js";
import { apiConfig } from "../config.js";
import { createWebhook, getWebhookById, getAllWebhooks, getAllWebhooksByUserId, deleteWebhookById } from "../services/webhooks.js";

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

export async function getAllWebhooksHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const webhooks = await getAllWebhooks();
        res.status(200).json(webhooks);

    } catch(err: unknown) {
        next(err);

    }
}

export async function getAllWebhooksByUserIdHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId as string;
        const webhooks = await getAllWebhooksByUserId(userId);
        res.status(200).json(webhooks);

    } catch(err: unknown) {
        next(err);

    }
}

export async function deleteWebhookByIdHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const webhookId = req.params.id as string;
        const token = getBearerToken(req);
        const userId = validateJWT(token, apiConfig.jwtConfig.secretKey);
        await deleteWebhookById(webhookId, userId);
        res.status(204).send();

    } catch(err: unknown) {
        next(err);

    }
}