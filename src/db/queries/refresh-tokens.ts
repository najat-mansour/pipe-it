import { RefreshToken, RefreshTokenRequestDTO } from "../../types/refresh-tokens.js";
import { db } from "../index.js";
import { refreshTokens } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createRefreshToken(refreshToken: RefreshTokenRequestDTO): Promise<void> {
    await db.insert(refreshTokens).values(refreshToken).returning();
}

export async function getRefreshTokenByToken(token: string): Promise<RefreshToken> {
    const [result] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token));
    return result;
}

export async function revokeRefreshToken(token: string): Promise<void> {
    await db.update(refreshTokens).set({ revokedAt: new Date() }).where(eq(refreshTokens.token, token)).returning();
}