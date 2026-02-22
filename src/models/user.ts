export type UserRole = "admin" | "user" | "manager";

export interface IUser {
    id?: number;
    username: string;
    password: string;
    role: UserRole;
    refreshToken?: string | null;
}

export interface IRefreshToken {
    id?: number;
    userId: number;
    token: string;
    expiresAt: Date;
    createdAt?: Date | null;
}