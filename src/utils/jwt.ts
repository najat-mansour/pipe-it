import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { UnAuthorizedError } from "../errors/http-errors.js";
import { Request } from "express";
import crypto from "crypto";
import { apiConfig } from "../config.js";

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string): string {
  const payload: Payload = {
    iss: "pipe-it",
    sub: userID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + apiConfig.jwtConfig.expiredIn,
  };

  const token = jwt.sign(payload, apiConfig.jwtConfig.secretKey);
  return token;
}

export function validateJWT(tokenString: string): string {
  try {
    const payload = jwt.verify(
      tokenString,
      apiConfig.jwtConfig.secretKey,
    ) as Payload;
    return payload.sub as string;
  } catch {
    throw new UnAuthorizedError("Invalid JWT token!");
  }
}

export function getBearerToken(req: Request): string {
  const authHeader = req.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnAuthorizedError("Missing or invalid Authorization header!");
  }
  return authHeader.substring(7);
}

export function makeRefreshToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
