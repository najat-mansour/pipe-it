import {
  toUserResponseDTO,
  UserRequestDTO,
  UserResponseDTO,
} from "../types/users.js";
import {
  createUserDB,
  deleteUserDB,
  getAllUsersDB,
  getUserByEmailDB,
  getUserByIdDB,
  getUserByUsernameDB,
  updatePasswordDB,
  updateUserDB,
} from "../db/queries/users.js";
import { checkPasswordHash, hashPassword } from "../utils/encryption.js";
import {
  BadRequestError,
  UnAuthorizedError,
  NotFoundError,
} from "../errors/http-errors.js";
import { isStrongPassword } from "../utils/password-strength-checker.js";
import { makeJWT, makeRefreshToken } from "../utils/jwt.js";
import { generateRandomPassword } from "../utils/password-generator.js";
import { generateForgetPasswordHtmlTemplate } from "../utils/templates-generator.js";
import { sendMail } from "../utils/email-sender.js";
import {
  getRefreshTokenByUserIdDB,
  createRefreshTokenDB,
  updateRefreshTokeDB,
} from "../db/queries/refresh-tokens.js";
import { apiConfig } from "../config.js";

async function checkUsernameAndEmailUniqueness(
  username?: string,
  email?: string,
  userId?: string,
): Promise<void> {
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

async function checkPasswordStrengthAndHashIt(
  password?: string,
): Promise<string | undefined> {
  if (password) {
    if (!isStrongPassword(password)) {
      throw new BadRequestError("Weak Password!");
    }
    return await hashPassword(password);
  }
}

export async function createUser(
  user: UserRequestDTO,
): Promise<UserResponseDTO> {
  await checkUsernameAndEmailUniqueness(user.username, user.email);
  user.password = (await checkPasswordStrengthAndHashIt(
    user.password,
  )) as string;
  const createdUser = await createUserDB(user);
  return toUserResponseDTO(createdUser);
}

export async function login(
  username: string,
  password: string,
): Promise<UserResponseDTO & { token: string; refreshToken: string }> {
  const existedUser = await getUserByUsernameDB(username);
  if (!existedUser) {
    throw new UnAuthorizedError("Invalid username!");
  }

  if (!(await checkPasswordHash(existedUser.password, password))) {
    throw new UnAuthorizedError("Wrong password!");
  }

  //! Create a JWT token and refresh token
  const token = makeJWT(existedUser.id);
  const refreshToken = makeRefreshToken();

  //! Insert a new record / update an existing one
  const dataToBeInsertedOrUpdated = {
    token: refreshToken,
    userId: existedUser.id,
    expiresAt: new Date(Date.now() + apiConfig.refreshTokenExpiredIn),
  };
  const existedRefreshToken = await getRefreshTokenByUserIdDB(existedUser.id);
  if (existedRefreshToken) {
    await updateRefreshTokeDB(
      existedRefreshToken.userId,
      dataToBeInsertedOrUpdated,
    );
  } else {
    await createRefreshTokenDB(dataToBeInsertedOrUpdated);
  }

  return {
    token,
    refreshToken,
    ...toUserResponseDTO(existedUser),
  };
}

export async function getUserById(id: string): Promise<UserResponseDTO> {
  if (id.length !== 36) {
    throw new BadRequestError("Invalid user ID!");
  }
  const existedUser = await getUserByIdDB(id);
  if (!existedUser) {
    throw new NotFoundError("User not found!");
  }
  return toUserResponseDTO(existedUser);
}

export async function getAllUsers(): Promise<UserResponseDTO[]> {
  const users = await getAllUsersDB();
  if (users.length === 0) {
    throw new NotFoundError("No users found!");
  }
  return users.map((user) => toUserResponseDTO(user));
}

export async function deleteUser(id: string): Promise<void> {
  if (id.length !== 36) {
    throw new BadRequestError("Invalid user ID!");
  }
  const existedUser = await getUserByIdDB(id);
  if (!existedUser) {
    throw new BadRequestError("User not found!");
  }
  await deleteUserDB(id);
}

export async function updateUser(
  id: string,
  user: Partial<UserRequestDTO>,
): Promise<UserResponseDTO> {
  const existedUserById = await getUserById(id);
  if (!existedUserById) {
    throw new BadRequestError("User not found!");
  }
  checkUsernameAndEmailUniqueness(user.username, user.email, id);
  user.password = (await checkPasswordStrengthAndHashIt(
    user.password,
  )) as string;
  const updatedUser = await updateUserDB(id, user);
  return toUserResponseDTO(updatedUser);
}

export async function forgetPassword(
  username: string,
  email: string,
): Promise<void> {
  const existedUserByUsername = await getUserByUsernameDB(username);
  if (!existedUserByUsername) {
    throw new BadRequestError("User not found!");
  }
  if (existedUserByUsername.email !== email) {
    throw new BadRequestError(
      "The sent email doesn't match your registered one!",
    );
  }
  //! Generate a new password
  const newPassword = generateRandomPassword();
  //! Hash it
  const newHashedPassword = (await checkPasswordStrengthAndHashIt(
    newPassword,
  )) as string;
  //! Save it in the database
  await updatePasswordDB(username, newHashedPassword);
  //! Get the generated template
  const generateHtmlTemplate = generateForgetPasswordHtmlTemplate(newPassword);
  //! Sent the email
  await sendMail(email, "New Password", generateHtmlTemplate);
}
