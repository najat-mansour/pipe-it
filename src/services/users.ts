import { toUserResponseDTO, UserRequestDTO, UserResponseDTO } from "../types/users.js";
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

export async function createUser(user: UserRequestDTO): Promise<UserResponseDTO> {
  checkUsernameAndEmailUniqueness(user.username, user.email);
  user.password = await checkPasswordStrengthAndHashIt(user.password) as string;
  const createdUser = await createUserDB(user);
  return toUserResponseDTO(createdUser);
}

export async function login(username: string, password: string): Promise<UserResponseDTO & { token: string }> {
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
    ...toUserResponseDTO(existedUser)
  }
}

export async function getUserById(id: string): Promise<UserResponseDTO> {
  if(id.length !== 36) {
    throw new BadRequestError("Invalid user ID!");
  }
  const existedUser = await getUserByIdDB(id);
  if(!existedUser) {
    throw new BadRequestError("User not found!");
  }     
  return toUserResponseDTO(existedUser);
} 

export async function getAllUsers(): Promise<UserResponseDTO[]> {
  const users = await getAllUsersDB();
  if (users.length === 0) {
    throw new BadRequestError("No users found!");
  }
  return users.map((user) => toUserResponseDTO(user));
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

export async function updateUser(id: string, user: Partial<UserRequestDTO>): Promise<UserResponseDTO> {
  const existedUserById = await getUserById(id);
  if (!existedUserById) {
    throw new BadRequestError("User not found!");
  }
  checkUsernameAndEmailUniqueness(user.username, user.email, id);
  user.password = await checkPasswordStrengthAndHashIt(user.password) as string;
  const updatedUser = await updateUserDB(id, user);
  return toUserResponseDTO(updatedUser);
}
