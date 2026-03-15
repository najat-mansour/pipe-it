import { LoggedInUser, NewUser, UpdateUser, UserWithoutPassword } from "../db/types.js";
import { createUserDB, deleteUserDB, getAllUsersDB, getUserByEmailDB, getUserByIdDB, getUserByUsernameDB, updateUserDB } from "../db/queries/users.js";
import { checkPasswordHash, hashPassword } from "../utils/encryption.js";
import { BadRequestError, UnAuthorizedError } from "../errors/http-errors.js";
import { isStrongPassword } from "../utils/password-strength-checker.js";
import { makeJWT } from "../utils/jwt.js";
import { apiConfig } from "../config.js";

async function checkUsernameAndEmailUniqueness(username?: string, email?: string, userId?: string): Promise<void> {
  if (username) {
    const existedUserByUsername = await getUserByUsernameDB(username);
    if (existedUserByUsername && existedUserByUsername.id !== userId) {
      throw new BadRequestError("Username is already existed!");
    }
  }

  if (email) {
    const existedUserByEmail = await getUserByEmailDB(email);
    if (existedUserByEmail && existedUserByEmail.id !== userId) {
      throw new BadRequestError("Email is already existed!");
    }
  }
}

async function checkPasswordStrengthAndHashIt(password?: string): Promise<string | undefined> {
  if (password) {
    if (!isStrongPassword(password)) {
      throw new BadRequestError("Weak Password!");
    }
    return await hashPassword(password);
  }
}

export async function createUser(user: NewUser): Promise<UserWithoutPassword> {
  checkUsernameAndEmailUniqueness(user.username, user.email);
  user.password = await checkPasswordStrengthAndHashIt(user.password) as string;
  const createdUser = await createUserDB(user);
  return {
    id: createdUser.id,
    firstName: createdUser.firstName,
    lastName: createdUser.lastName,
    username: createdUser.username,
    email: createdUser.email,
    createdAt: createdUser.createdAt,
    updatedAt: createdUser.updatedAt
  }
}

export async function login(username: string, password: string): Promise<LoggedInUser> {
  const existedUser = await getUserByUsernameDB(username);
  if (!existedUser) {
    throw new UnAuthorizedError("Invalid username!");
  }

  if (!await checkPasswordHash(existedUser.password, password)) {
    throw new UnAuthorizedError("Wrong password!");
  } 

  const token = makeJWT(existedUser.id, apiConfig.jwtConfig.expiredIn, apiConfig.jwtConfig.secretKey);
  return {
    token,
    id: existedUser.id,
    firstName: existedUser.firstName,
    lastName: existedUser.lastName,
    username: existedUser.username,
    email: existedUser.email,
    createdAt: existedUser.createdAt,
    updatedAt: existedUser.updatedAt
  }
}

export async function getUserById(id: string): Promise<UserWithoutPassword> {
  if(id.length !== 36) {
    throw new BadRequestError("Invalid user ID!");
  }
  const existedUser = await getUserByIdDB(id);
  if(!existedUser) {
    throw new BadRequestError("User not found!");
  }     
  return {
    id: existedUser.id,
    firstName: existedUser.firstName,
    lastName: existedUser.lastName,
    username: existedUser.username,
    email: existedUser.email,
    createdAt: existedUser.createdAt,
    updatedAt: existedUser.updatedAt
  }
} 

export async function getAllUsers(): Promise<UserWithoutPassword[]> {
  const users = await getAllUsersDB();
  if (users.length === 0) {
    throw new BadRequestError("No users found!");
  }
  return users.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }));
}

export async function deleteUser(id: string): Promise<void> {
  if(id.length !== 36) {
    throw new BadRequestError("Invalid user ID!");
  }  
  const existedUser = await getUserByIdDB(id);
  if ( !existedUser) {
    throw new BadRequestError("User not found!");
  } 
  await deleteUserDB(id);
}   

export async function updateUser(id: string, user: UpdateUser): Promise<UserWithoutPassword> {
  const existedUserById = await getUserById(id);
  if (!existedUserById) {
    throw new BadRequestError("User not found!");
  }
  checkUsernameAndEmailUniqueness(user.username, user.email, id);
  user.password = await checkPasswordStrengthAndHashIt(user.password) as string;
  const updatedUser = await updateUserDB(id, user);
  return {
    id: updatedUser.id,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    username: updatedUser.username,
    email: updatedUser.email,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt
  };
}
