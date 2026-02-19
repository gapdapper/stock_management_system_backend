import db from "@/db/connect";
import * as schema from "@/db/schema";
import type { IRefreshToken, IUser } from "@/models/user";
import { eq } from "drizzle-orm";

export const findUserByUsername = async (username: string): Promise<IUser | undefined> => {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.username, username),
  });
  return user;
};

export const findUserById = async (id: number): Promise<IUser | undefined> => {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, id),
  });
  return user;
}

export const addUser = async (user: IUser): Promise<{ id: number }> => {
  const result = await db
    .insert(schema.users)
    .values({
      username: user.username,
      password: user.password,
      role: "user",
      firstName: user.firstName,
      lastName: user.lastName,
    }).returning({ id: schema.users.id });
  return result[0]!;
};

export const findRefreshToken = async (token: string): Promise<IRefreshToken | undefined> => {
  const refreshTokenRecord = await db.query.refreshTokens.findFirst({
    where: eq(schema.refreshTokens.token, token),
  });
  return refreshTokenRecord;
}

export const revokeRefreshToken = async (id: number): Promise<void> => {
  await db.delete(schema.refreshTokens).where(eq(schema.refreshTokens.id, id));
}

export const revokeRefreshTokenByHashed = async (tokenHash: string): Promise<void> => {
  await db.delete(schema.refreshTokens).where(eq(schema.refreshTokens.token, tokenHash));
}

export const upsertRefreshToken = async (refreshTokenRecord: IRefreshToken): Promise<void> => {
  const { userId, token, expiresAt } = refreshTokenRecord;
  await db
    .insert(schema.refreshTokens)
    .values({
      userId,
      token,
      expiresAt,
    })
    .onConflictDoUpdate({
      target: schema.refreshTokens.userId,
      set: {
        token,
        expiresAt,
      },
    });
}

export const updateRefreshToken = async (refreshTokenRecord: IRefreshToken): Promise<void> => {
  const { userId, token, expiresAt } = refreshTokenRecord;
  await db
    .update(schema.refreshTokens)
    .set({
      token,
      expiresAt,
    })
    .where(eq(schema.refreshTokens.userId, userId));
}

export const getUserProfileById = async (userId: number): Promise<Partial<IUser> | undefined> => {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
    columns: {
      id: true,
      username: true,
      role: true,
      firstName: true,
      lastName: true,
    },
  });
  return user;
}