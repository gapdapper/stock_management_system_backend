import type { Request, Response, NextFunction } from "express";
import * as authService from "@/services/authService";
import BadRequestError from "@/utils/errors/bad-request";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      throw new BadRequestError({
        code: 400,
        message: "All fields are required!",
        logging: true,
      });
    }
    const result = await authService.registerUser({
      username,
      password,
      role,
    });
    res
      .status(201)
      .json({ message: "User registered successfully", userId: result.id });
  } catch (error) {
    next(error);
  }
};

export const checkAvailableUsernames = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username } = req.query;
    if (!username || typeof username !== "string") {
      throw new BadRequestError({
        code: 400,
        message: "Username is required and must be a string!",
        logging: true,
      });
    }
    const result = await authService.checkAvailableUsernames(username);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      throw new BadRequestError({
        code: 400,
        message: "Username and password are required!",
        logging: true,
      });
    }
    const { accessToken, refreshToken } = await authService.loginUser({
      username,
      password,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE), // 24 hours is mileseconds
      sameSite: "strict",
    });

    res.status(200).json({
      accessToken,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Cookies before clearing:", req.cookies);
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(200).json({ message: "Logout successful" });
  }

  await authService.logoutUser(refreshToken);
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Logout successful" });
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not provided" });
  }

  const { newAccessToken, newRefreshToken } =
    await authService.refreshToken(refreshToken);

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE),
    sameSite: "strict",
  });

  return res.status(200).json({ accessToken: newAccessToken });
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new BadRequestError({
        code: 400,
        message: "Authorization header is missing or malformed",
        logging: true,
      });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new BadRequestError({
        code: 400,
        message: "Access token is missing",
        logging: true,
      });
    }
    const userProfile = await authService.getUserProfile(token);
    res.status(200).json({ profile: userProfile });
  } catch (error) {
    next(error);
  }
};
