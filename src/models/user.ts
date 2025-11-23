export type UserRole = "admin" | "user" | "manager";

export interface IUser {
    id?: number;
    username: string;
    password: string;
    role: UserRole;
    refreshToken?: string | null;
    firstName: string;
    lastName: string;
}