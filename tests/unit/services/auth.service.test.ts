jest.mock("@/repositories/authRepository", () => ({
  findUserByUsername: jest.fn(),
  upsertRefreshToken: jest.fn(),
  revokeRefreshTokenByHashed: jest.fn(),
  addUser: jest.fn(),
  findRefreshToken: jest.fn(),
  updateRefreshToken: jest.fn(),
  getUserProfileById: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  __esModule: true,
  default: {
    compare: jest.fn(),
    hash: jest.fn(),
  },
}));

jest.mock("jsonwebtoken", () => ({
  __esModule: true,
  default: {
    sign: jest.fn(),
    verify: jest.fn(),
  },
}));

import * as authRepository from "@/repositories/authRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";

import { loginUser, logoutUser, registerUser, checkAvailableUsernames, refreshToken, getUserProfile } from "@/services/authService";
import BadRequestError from "@/utils/errors/bad-request";
import UnauthorizedError from "@/utils/errors/unauthorized";

// #region UTC-05-07
describe("UTC-05-07: loginUser()", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    process.env.ACCESS_TOKEN_SECRET = "access-secret";
    process.env.REFRESH_TOKEN_SECRET = "refresh-secret";
    process.env.ACCESS_TOKEN_EXPIRATION = "1h";
    process.env.REFRESH_TOKEN_EXPIRATION = "7d";
    process.env.REFRESH_TOKEN_COOKIE_MAX_AGE = "86400000";
  });
    it("ID-01: Should throw BadRequestError when username invalid", async () => {
    await expect(
      loginUser({ username: "ab", password: "Password123" })
    ).rejects.toBeInstanceOf(BadRequestError);

    expect(authRepository.findUserByUsername).not.toHaveBeenCalled();
  });
    it("ID-02: Should throw BadRequestError when password invalid", async () => {
    await expect(
      loginUser({ username: "admin123", password: "123" })
    ).rejects.toBeInstanceOf(BadRequestError);

    expect(authRepository.findUserByUsername).not.toHaveBeenCalled();
  });
    it("ID-03: Should throw UnauthorizedError when user not found", async () => {
    (authRepository.findUserByUsername as jest.Mock)
      .mockResolvedValue(null);

    await expect(
      loginUser({ username: "admin123", password: "Password123" })
    ).rejects.toBeInstanceOf(UnauthorizedError);

    expect(authRepository.findUserByUsername)
      .toHaveBeenCalledWith("admin123");
  });
    it("ID-04: Should throw UnauthorizedError when password incorrect", async () => {
    (authRepository.findUserByUsername as jest.Mock)
      .mockResolvedValue({
        id: 1,
        username: "admin123",
        password: "hashed-password",
        role: "ADMIN",
      });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      loginUser({ username: "admin123", password: "Password123" })
    ).rejects.toBeInstanceOf(UnauthorizedError);

    expect(bcrypt.compare).toHaveBeenCalled();
  });
    it("ID-05: Should return accessToken and refreshToken when login successful", async () => {
    (authRepository.findUserByUsername as jest.Mock)
      .mockResolvedValue({
        id: 1,
        username: "admin123",
        password: "hashed-password",
        role: "ADMIN",
      });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    (jwt.sign as jest.Mock)
      .mockReturnValueOnce("mock-access-token")
      .mockReturnValueOnce("mock-refresh-token");

    (authRepository.upsertRefreshToken as jest.Mock)
      .mockResolvedValue(undefined);

    const result = await loginUser({
      username: "admin123",
      password: "Password123",
    });

    expect(result).toEqual({
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
    });

    expect(jwt.sign).toHaveBeenCalledTimes(2);

    expect(authRepository.upsertRefreshToken)
      .toHaveBeenCalledTimes(1);
  });
});

// #region UTC-05-08
describe("UTC-05-08: logoutUser()", () => {
  const mockRefreshToken = "mock-refresh-token";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("ID-01: Should hash refresh token and call repository", async () => {
    (authRepository.revokeRefreshTokenByHashed as jest.Mock)
      .mockResolvedValue(undefined);

    const expectedHash = crypto
      .createHash("sha256")
      .update(mockRefreshToken)
      .digest("hex");

    await logoutUser(mockRefreshToken);

    expect(authRepository.revokeRefreshTokenByHashed)
      .toHaveBeenCalledTimes(1);

    expect(authRepository.revokeRefreshTokenByHashed)
      .toHaveBeenCalledWith(expectedHash);
  });

  it("ID-02: Should propagate error when repository throws", async () => {
    (authRepository.revokeRefreshTokenByHashed as jest.Mock)
      .mockRejectedValue(new Error("DB error"));

    await expect(logoutUser(mockRefreshToken))
      .rejects
      .toThrow("DB error");
  });
});

// #region UTC-05-09
describe("UTC-05-09: registerUser()", () => {
  const validUser = {
    username: "testuser",
    password: "password123",
    role: "USER",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("ID-01: Should register user successfully", async () => {
    (authRepository.findUserByUsername as jest.Mock)
      .mockResolvedValue(undefined);

    (bcrypt.hash as jest.Mock)
      .mockResolvedValue("hashedPassword");

    (authRepository.addUser as jest.Mock)
      .mockResolvedValue({ id: 1 });

    const result = await registerUser(validUser);

    expect(authRepository.findUserByUsername)
      .toHaveBeenCalledWith(validUser.username);

    expect(bcrypt.hash)
      .toHaveBeenCalledWith(validUser.password, 10);

    expect(authRepository.addUser)
      .toHaveBeenCalledWith({
        ...validUser,
        password: "hashedPassword",
      });

    expect(result).toEqual({ id: 1 });
  });

  it("ID-02: Should throw error for invalid input format", async () => {
    const invalidUser = {
      username: "ab", // too short
      password: "123", // too short
      role: "USER",
    };

    await expect(registerUser(invalidUser))
      .rejects
      .toBeInstanceOf(BadRequestError);

    expect(authRepository.findUserByUsername)
      .not.toHaveBeenCalled();
  });

  it("ID-03: Should throw error when username already exists", async () => {
    (authRepository.findUserByUsername as jest.Mock)
      .mockResolvedValue({
        id: 1,
        username: "testuser",
        password: "hashed",
        role: "USER",
      });

    await expect(registerUser(validUser))
      .rejects
      .toBeInstanceOf(BadRequestError);

    expect(authRepository.addUser)
      .not.toHaveBeenCalled();
  });

  it("ID-04: Should propagate repository error", async () => {
    (authRepository.findUserByUsername as jest.Mock)
      .mockResolvedValue(undefined);

    (bcrypt.hash as jest.Mock)
      .mockResolvedValue("hashedPassword");

    (authRepository.addUser as jest.Mock)
      .mockRejectedValue(new Error("DB error"));

    await expect(registerUser(validUser))
      .rejects
      .toThrow("DB error");
  });
});

// #region UTC-05-10
describe("UTC-05-10: checkAvailableUsernames()", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("ID-01: Should return available when user does not exist", async () => {
    jest.spyOn(authRepository, "findUserByUsername")
      .mockResolvedValue(undefined);

    const result = await checkAvailableUsernames("newuser");

    expect(authRepository.findUserByUsername)
      .toHaveBeenCalledWith("newuser");

    expect(result).toEqual({ isAvailable: true });
  });

  it("ID-02: Should return unavailable when user exists", async () => {
    jest.spyOn(authRepository, "findUserByUsername")
      .mockResolvedValue({
        id: 1,
        username: "existinguser",
        password: "hashed",
        role: "user",
      });

    const result = await checkAvailableUsernames("existinguser");

    expect(authRepository.findUserByUsername)
      .toHaveBeenCalledWith("existinguser");

    expect(result).toEqual({ isAvailable: false });
  });

  it("ID-03: Should propagate repository error", async () => {
    jest.spyOn(authRepository, "findUserByUsername")
      .mockRejectedValue(new Error("DB error"));

    await expect(checkAvailableUsernames("anyuser"))
      .rejects
      .toThrow("DB error");
  });
});

// #region UTC-05-11
describe("UTC-05-11: refreshToken()", () => {

  const mockOldRefreshToken = "old-refresh-token";

  beforeEach(() => {
    process.env.ACCESS_TOKEN_SECRET = "access-secret";
    process.env.REFRESH_TOKEN_SECRET = "refresh-secret";
    process.env.ACCESS_TOKEN_EXPIRATION = "15m";
    process.env.REFRESH_TOKEN_EXPIRATION = "7d";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("ID-01: Should refresh tokens successfully", async () => {
    const payload = { sub: "1" };

    jest.spyOn(jwt, "verify")
      .mockReturnValue(payload as any);

    (jest.spyOn(jwt, "sign") as jest.Mock)
      .mockReturnValueOnce("new-access-token")
      .mockReturnValueOnce("new-refresh-token");

    const oldHash = crypto
      .createHash("sha256")
      .update(mockOldRefreshToken)
      .digest("hex");

    jest.spyOn(authRepository, "findRefreshToken")
      .mockResolvedValue({
        id: 10,
        userId: 1,
        token: oldHash,
        expiresAt: new Date(Date.now() + 100000),
      });

    jest.spyOn(authRepository, "updateRefreshToken")
      .mockResolvedValue(undefined);

    const result = await refreshToken(mockOldRefreshToken);

    expect(authRepository.findRefreshToken)
      .toHaveBeenCalled();

    expect(authRepository.updateRefreshToken)
      .toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 1,
          token: expect.any(String),
        })
      );

    expect(result).toEqual({
      newAccessToken: "new-access-token",
      newRefreshToken: "new-refresh-token",
    });
  });

  it("ID-02: Should throw error when payload.sub missing", async () => {
    jest.spyOn(jwt, "verify")
      .mockReturnValue({} as any);

    await expect(refreshToken(mockOldRefreshToken))
      .rejects
      .toBeInstanceOf(UnauthorizedError);
  });

  it("ID-03: Should throw error when token not found", async () => {
    jest.spyOn(jwt, "verify")
      .mockReturnValue({ sub: "1" } as any);

    jest.spyOn(authRepository, "findRefreshToken")
      .mockResolvedValue(undefined);

    await expect(refreshToken(mockOldRefreshToken))
      .rejects
      .toBeInstanceOf(UnauthorizedError);
  });

  it("ID-04: Should throw error when token expired", async () => {
    jest.spyOn(jwt, "verify")
      .mockReturnValue({ sub: "1" } as any);

    jest.spyOn(authRepository, "findRefreshToken")
      .mockResolvedValue({
        id: 10,
        userId: 1,
        token: "hash",
        expiresAt: new Date(Date.now() - 1000), // expired
      });

    await expect(refreshToken(mockOldRefreshToken))
      .rejects
      .toBeInstanceOf(UnauthorizedError);
  });

  it("ID-05: Should propagate repository error", async () => {
    jest.spyOn(jwt, "verify")
      .mockReturnValue({ sub: "1" } as any);

    jest.spyOn(authRepository, "findRefreshToken")
      .mockResolvedValue({
        id: 10,
        userId: 1,
        token: "hash",
        expiresAt: new Date(Date.now() + 100000),
      });

    (jest.spyOn(jwt, "sign") as jest.Mock)
      .mockReturnValue("token");

    jest.spyOn(authRepository, "updateRefreshToken")
      .mockRejectedValue(new Error("DB error"));

    await expect(refreshToken(mockOldRefreshToken))
      .rejects
      .toThrow("DB error");
  });
});

// #region UTC-05-12
describe("UTC-05-12: getUserProfile()", () => {

  const mockToken = "valid-access-token";

  beforeEach(() => {
    process.env.ACCESS_TOKEN_SECRET = "access-secret";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("ID-01: Should return user profile successfully", async () => {
    (jest.spyOn(jwt, "verify") as jest.Mock)
      .mockReturnValue({ sub: "1" });

    jest.spyOn(authRepository, "getUserProfileById")
      .mockResolvedValue({
        id: 1,
        username: "testuser",
        role: "user",
      });

    const result = await getUserProfile(mockToken);

    expect(authRepository.getUserProfileById)
      .toHaveBeenCalledWith(1);

    expect(result).toEqual({
      id: 1,
      username: "testuser",
      role: "user",
    });
  });

  it("ID-02: Should throw error when payload.sub missing", async () => {
    (jest.spyOn(jwt, "verify") as jest.Mock)
      .mockReturnValue({});

    await expect(getUserProfile(mockToken))
      .rejects
      .toBeInstanceOf(UnauthorizedError);
  });

  it("ID-03: Should throw error when user not found", async () => {
    (jest.spyOn(jwt, "verify") as jest.Mock)
      .mockReturnValue({ sub: "1" });

    jest.spyOn(authRepository, "getUserProfileById")
      .mockResolvedValue(undefined);

    await expect(getUserProfile(mockToken))
      .rejects
      .toBeInstanceOf(UnauthorizedError);
  });

  it("ID-04: Should propagate repository error", async () => {
    (jest.spyOn(jwt, "verify") as jest.Mock)
      .mockReturnValue({ sub: "1" });

    jest.spyOn(authRepository, "getUserProfileById")
      .mockRejectedValue(new Error("DB error"));

    await expect(getUserProfile(mockToken))
      .rejects
      .toThrow("DB error");
  });
});