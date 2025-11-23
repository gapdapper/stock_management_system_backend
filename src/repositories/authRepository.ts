import db from "@/db/connect";
import * as schema from "@/db/schema";
import type { IUser } from "@/models/user";
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

export const storeRefreshToken = async (userId: number, refreshToken: string): Promise<void> => {
  await db
    .update(schema.users)
    .set({ refreshToken: refreshToken })
    .where(eq(schema.users.id, userId));
}

export const removeRefreshToken = async (refreshToken: string): Promise<void> => {
  await db
    .update(schema.users)
    .set({ refreshToken: null })
    .where(eq(schema.users.refreshToken, refreshToken));
}

export default {
  findUserByUsername,
  addUser,
  storeRefreshToken,
  removeRefreshToken,
  findUserById,
};
