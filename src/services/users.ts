import { NewUser, UserWithoutPassword } from "../db/schema.js";
import { createUserDB, getUserByEmailDB } from "../db/queries/users.js";
import { hashPassword } from "../utils/encryption.js";
import { BadRequestError } from "../errors/http-errors.js";
import { isStrongPassword } from "../utils/password-checker.js";

export async function createUser(user: NewUser): Promise<UserWithoutPassword> {
  const existedUser = await getUserByEmailDB(user.email);
  if (existedUser) {
    throw new BadRequestError("Email is already existed!");
  }
  if (!isStrongPassword(user.password)) {
    throw new BadRequestError("Weak Password!");
  }
  user.password = await hashPassword(user.password);
  const { id, email, firstName, lastName, createdAt, updatedAt } =
    await createUserDB(user);
  return { id, email, firstName, lastName, createdAt, updatedAt };
}
