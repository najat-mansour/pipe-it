import { getRefreshTokenByTokenDB, revokeRefreshTokenDB } from "../db/queries/refresh-tokens.js";
import { UnAuthorizedError } from "../errors/http-errors.js";
import { makeJWT } from "../utils/jwt.js";

export async function refreshToken(token: string): Promise<{ jwtToken: string }> {
    const refreshToken = await getRefreshTokenByTokenDB(token);
    if (!refreshToken || refreshToken.revokedAt != null || Date.now() > refreshToken.expiresAt.getTime()) {
        throw new UnAuthorizedError("Invalid refresh token!");
    }
    const jwtToken = makeJWT(refreshToken.userId);
    return {
        jwtToken
    };
}

export async function revokeToken(token: string): Promise<void> {
    await revokeRefreshTokenDB(token);
}