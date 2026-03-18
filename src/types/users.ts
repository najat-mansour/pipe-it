export type User = {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
};
export type UserRequestDTO = Pick<User, "firstName" | "lastName" | "username" | "password" | "email">;
export type UserResponseDTO = Pick<User, "id" | "firstName" | "lastName" | "username" | "email">;

export function toUserResponseDTO(user: User): UserResponseDTO {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email
    }
}