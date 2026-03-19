import bcrypt from "bcryptjs";
import * as authRepository from "@/repositories/authRepository";
import BadRequestError from "@/utils/errors/bad-request";
import jwt, { type SignOptions } from "jsonwebtoken";
import UnauthorizedError from "@/utils/errors/unauthorized";
import * as crypto from "crypto";

export const registerUser = async (user: any): Promise<{ id: number }> => {
  const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
  const passwordRegex = /^[a-zA-Z0-9]{8,20}$/;

  if (!usernameRegex.test(user.username) || !passwordRegex.test(user.password)) {
    throw new BadRequestError({
      message: "Invalid input format.",
      logging: true,
    });
  }

  const isUsernameExist = await authRepository.findUserByUsername(
    user.username
  );

  if (isUsernameExist) {
    throw new BadRequestError({
      code: 400,
      message: "Username already exists!",
      logging: true,
    });
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = await authRepository.addUser({
    ...user,
    password: hashedPassword,
  });
  return newUser;
};

export const loginUser = async (credentials: {
  username: string;
  password: string;
}): Promise<{ accessToken: string; refreshToken: string }> => {
  const { username, password } = credentials;

  const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
  const passwordRegex = /^[a-zA-Z0-9]{8,20}$/;

  if (!usernameRegex.test(username) || !passwordRegex.test(password)) {
    throw new BadRequestError({
      message: "Invalid input format.",
      logging: true,
    });
  }

  const user = await authRepository.findUserByUsername(username);

  if (!user || !user.id) {
    throw new UnauthorizedError({
      message: "Invalid username or password.",
      logging: true,
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError({
      message: "Invalid username or password.",
      logging: true,
    });
  }

  const accessToken = jwt.sign(
    { sub: user.id.toString(),
      role: user.role,
     },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION } as SignOptions
  );

  const refreshToken = jwt.sign(
    { sub: user.id.toString() },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION } as SignOptions
  );

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await authRepository.upsertRefreshToken({
    userId: Number(user.id),
    token: refreshTokenHash,
    expiresAt: new Date(
      Date.now() +
        parseInt(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE as string)
    ),
  });

  return { accessToken, refreshToken };
};

export const logoutUser = async (refreshToken: string): Promise<void> => {
  const tokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await authRepository.revokeRefreshTokenByHashed(tokenHash);
};

export const refreshToken = async (
  refreshToken: string
): Promise<{ newAccessToken: string; newRefreshToken: string }> => {
  const payload = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string
  ) as jwt.JwtPayload;

  if (!payload.sub) {
    throw new UnauthorizedError({
      code: 401,
      message: "Invalid refresh token payload",
      logging: true,
    });
  }

  const tokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const refreshTokenRecord = await authRepository.findRefreshToken(tokenHash);

  if (
    !refreshTokenRecord ||
    refreshTokenRecord.expiresAt < new Date() ||
    !refreshTokenRecord.id
  ) {
    throw new UnauthorizedError({
      code: 401,
      message: "Invalid refresh token!",
      logging: true,
    });
  }

  const userId = Number(payload.sub);

  const newAccessToken = jwt.sign(
    { sub: userId },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION } as SignOptions
  );

  const newRefreshToken = jwt.sign(
    { sub: userId },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION } as SignOptions
  );

  const newTokenHash = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  await authRepository.updateRefreshToken({
    userId,
    token: newTokenHash,
    expiresAt: refreshTokenRecord.expiresAt,
  });

  return { newAccessToken, newRefreshToken };
};

export const getUserProfile = async (token: string): Promise<any> => {
  const payload = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string
  ) as jwt.JwtPayload;
  if (!payload.sub) {
    throw new UnauthorizedError({
      code: 401,
      message: "Invalid access token payload",
      logging: true,
    });
  }
  const userId = Number(payload.sub);
  const userProfile = await authRepository.getUserProfileById(userId);
  if (!userProfile) {
    throw new UnauthorizedError({
      code: 401,
      message: "User profile not found",
      logging: true,
    });
  }
  return userProfile;
}

export const checkAvailableUsernames = async (username: string) => {
  const existingUser  = await authRepository.findUserByUsername(username);
  return {
    isAvailable: !existingUser,
  };
}