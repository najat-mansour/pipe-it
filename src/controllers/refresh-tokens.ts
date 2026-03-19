import { Request, Response, NextFunction } from "express";
import { getBearerToken } from "../utils/jwt.js";
import { refreshToken, revokeToken } from "../services/refresh-tokens.js";

export async function refreshTokenHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const token = getBearerToken(req);
        const jwtToken = await refreshToken(token);
        res.status(200).json(jwtToken);

    } catch(err: unknown) {
        next(err);

    }
}

export async function revokeTokenHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const token = getBearerToken(req);
        await revokeToken(token);
        res.status(204).send();

    } catch(err: unknown) {
        next(err);

    }
}
