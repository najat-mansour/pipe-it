export type RefreshToken = {
  createdAt: Date;
  updatedAt: Date;
  token: string;
  userId: string;
  expiresAt: Date;
  revokedAt: Date | null;
};

export type RefreshTokenRequestDTO = Pick<
  RefreshToken,
  "token" | "userId" | "expiresAt"
>;
