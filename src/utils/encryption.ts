import argon2 from "argon2";

export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await argon2.hash(password);
  return hashedPassword;
}

export async function checkPasswordHash(hashedPassword: string, password: string): Promise<boolean> {
  return await argon2.verify(hashedPassword, password);
}
