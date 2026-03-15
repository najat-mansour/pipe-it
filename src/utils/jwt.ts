import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { UnAuthorizedError } from "../errors/http-errors.js";
import { Request } from "express";

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const payload: Payload = {
        iss: "pipe-it",
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiresIn,
    };

    const token = jwt.sign(payload, secret);
    return token;
}

export function validateJWT(tokenString: string, secret: string): string {
    try {
        const payload = jwt.verify(tokenString, secret) as Payload;
        return payload.sub as string;

    } catch (err: unknown) {
        throw new UnAuthorizedError("Invalid JWT token!");

    }
}

export function getBearerToken(req: Request): string {
    const authHeader = req.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnAuthorizedError("Missing or invalid Authorization header!");
    }
    return authHeader.substring(7);
}