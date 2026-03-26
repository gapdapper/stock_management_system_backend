jest.mock("@/services/authService", () => ({
  loginUser: jest.fn(),
  logoutUser: jest.fn(),
  registerUser: jest.fn(),
  checkAvailableUsernames: jest.fn(),
  refreshToken: jest.fn(),
  getUserProfile: jest.fn(),
}));

import { type Request, type Response, type NextFunction } from "express";
import * as authService from "@/services/authService";
import {
  login,
  logout,
  register,
  checkAvailableUsernames,
  refreshToken,
  getProfile,
} from "@/controllers/authController";
import BadRequestError from "@/utils/errors/bad-request";

// #region UTC-05-01
describe("UTC-05-01: login()", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  const mockLoginUser = authService.loginUser as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      body: {},
    };

    mockRes = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  it("ID-01: Should call next when required fields missing", async () => {
    mockReq.body = { username: "", password: "" };

    await login(mockReq as Request, mockRes as Response, mockNext);

    expect(mockLoginUser).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });

  it("ID-02: Should return accessToken and set refreshToken cookie", async () => {
    mockReq.body = {
      username: "admin",
      password: "1234",
    };

    mockLoginUser.mockResolvedValue({
      accessToken: "mock-access",
      refreshToken: "mock-refresh",
    });

    await login(mockReq as Request, mockRes as Response, mockNext);

    expect(mockLoginUser).toHaveBeenCalledWith({
      username: "admin",
      password: "1234",
    });

    expect(mockRes.cookie).toHaveBeenCalledWith(
      "refreshToken",
      "mock-refresh",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "lax",
      }),
    );

    expect(mockRes.status).toHaveBeenCalledWith(200);

    expect(mockRes.json).toHaveBeenCalledWith({
      accessToken: "mock-access",
      message: "Login successful",
    });

    expect(mockNext).not.toHaveBeenCalled();
  });

  it("ID-03: Should call next when service throws error", async () => {
    mockReq.body = {
      username: "admin",
      password: "wrong",
    };

    mockLoginUser.mockRejectedValue(new Error("Invalid credentials"));

    await login(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});

// #region UTC-05-02
describe("UTC-05-02: logout()", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      cookies: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  it("ID-01: Should return 200 when no refreshToken", async () => {
    req.cookies = {};
    await logout(req, res, next);

    expect(authService.logoutUser).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Logout successful",
    });

    expect(res.clearCookie).not.toHaveBeenCalled();
  });

  it("ID-02: Should call logoutUser, clear cookie and return 200 when refreshToken exists", async () => {
    req.cookies = { refreshToken: "mock-refresh-token" };

    (authService.logoutUser as jest.Mock).mockResolvedValue(undefined);

    await logout(req, res, next);

    expect(authService.logoutUser).toHaveBeenCalledWith("mock-refresh-token");

    expect(res.clearCookie).toHaveBeenCalledWith("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Logout successful",
    });
  });

  it("ID-03: Should throw error when logoutUser fails", async () => {
    req.cookies = { refreshToken: "mock-refresh-token" };

    const mockError = new Error("Service error");

    (authService.logoutUser as jest.Mock).mockRejectedValue(mockError);

    await expect(logout(req, res, next)).rejects.toThrow("Service error");

    expect(authService.logoutUser).toHaveBeenCalled();
  });
});

// #region UTC-05-03
describe("UTC-05-03: register()", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });
  it("ID-01: Should register user and return 201", async () => {
    req.body = {
      username: "admin",
      password: "1234",
      role: "ADMIN",
    };

    (authService.registerUser as jest.Mock).mockResolvedValue({
      id: 1,
    });

    await register(req, res, next);

    expect(authService.registerUser).toHaveBeenCalledWith({
      username: "admin",
      password: "1234",
      role: "ADMIN",
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered successfully",
      userId: 1,
    });

    expect(next).not.toHaveBeenCalled();
  });
  it("ID-02: Should call next with BadRequestError when fields missing", async () => {
    req.body = {
      username: "admin",
      password: "1234",
      // role missing
    };

    await register(req, res, next);

    expect(authService.registerUser).not.toHaveBeenCalled();

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(BadRequestError);
  });
  it("ID-03: Should call next when registerUser throws error", async () => {
    req.body = {
      username: "admin",
      password: "1234",
      role: "ADMIN",
    };

    const mockError = new Error("Service failed");

    (authService.registerUser as jest.Mock).mockRejectedValue(mockError);

    await register(req, res, next);

    expect(authService.registerUser).toHaveBeenCalled();

    expect(next).toHaveBeenCalledWith(mockError);
  });
});

// #region UTC-05-04
describe("UTC-05-04: checkAvailableUsernames()", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });
  it("ID-01: Should return 200 with isAvailable result", async () => {
    req.query = { username: "admin" };

    const mockResult: { isAvailable: boolean } = {
      isAvailable: true,
    };

    (authService.checkAvailableUsernames as jest.Mock).mockResolvedValue(
      mockResult,
    );

    await checkAvailableUsernames(req, res, next);

    expect(authService.checkAvailableUsernames).toHaveBeenCalledWith("admin");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      isAvailable: true,
    });

    expect(next).not.toHaveBeenCalled();
  });
  it("ID-02: Should call next when username is missing", async () => {
    req.query = {};

    await checkAvailableUsernames(req, res, next);

    expect(authService.checkAvailableUsernames).not.toHaveBeenCalled();

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(BadRequestError);
  });
  it("ID-03: Should call next when username is not string", async () => {
    req.query = { username: 12345 }; // invalid type

    await checkAvailableUsernames(req, res, next);

    expect(authService.checkAvailableUsernames).not.toHaveBeenCalled();

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(BadRequestError);
  });
  it("ID-04: Should call next when service throws error", async () => {
    req.query = { username: "admin" };

    const mockError = new Error("Service failed");

    (authService.checkAvailableUsernames as jest.Mock).mockRejectedValue(
      mockError,
    );

    await checkAvailableUsernames(req, res, next);

    expect(authService.checkAvailableUsernames).toHaveBeenCalledWith("admin");

    expect(next).toHaveBeenCalledWith(mockError);
  });
});

// #region UTC-05-05
describe("UTC-05-05: refreshToken()", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      cookies: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };

    next = jest.fn();

    process.env.REFRESH_TOKEN_COOKIE_MAX_AGE = "86400000";

    jest.clearAllMocks();
  });
    it("ID-01: Should return 401 when refreshToken not provided", async () => {
    req.cookies = {};

    await refreshToken(req, res, next);

    expect(authService.refreshToken).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Refresh token not provided",
    });
  });
    it("ID-02: Should set new refreshToken cookie and return new accessToken", async () => {
    req.cookies = { refreshToken: "old-refresh-token" };

    (authService.refreshToken as jest.Mock).mockResolvedValue({
      newAccessToken: "new-access-token",
      newRefreshToken: "new-refresh-token",
    });

    await refreshToken(req, res, next);

    expect(authService.refreshToken)
      .toHaveBeenCalledWith("old-refresh-token");

    expect(res.cookie).toHaveBeenCalledWith(
      "refreshToken",
      "new-refresh-token",
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE),
        sameSite: "lax",
      },
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      accessToken: "new-access-token",
    });
  });
    it("ID-03: Should throw error when service fails", async () => {
    req.cookies = { refreshToken: "old-refresh-token" };

    const mockError = new Error("Invalid refresh token");

    (authService.refreshToken as jest.Mock)
      .mockRejectedValue(mockError);

    await expect(refreshToken(req, res, next))
      .rejects.toThrow("Invalid refresh token");

    expect(authService.refreshToken)
      .toHaveBeenCalledWith("old-refresh-token");
  });
});

// #region UTC-05-06
describe("UTC-05-06: getProfile()", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });
    it("ID-01: Should call next when authorization header missing", async () => {
    req.headers = {};

    await getProfile(req, res, next);

    expect(authService.getUserProfile).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(BadRequestError);
  });
    it("ID-02: Should call next when header malformed", async () => {
    req.headers = {
      authorization: "InvalidTokenFormat",
    };

    await getProfile(req, res, next);

    expect(authService.getUserProfile).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(BadRequestError);
  });
    it("ID-03: Should call next when token missing after Bearer", async () => {
    req.headers = {
      authorization: "Bearer ",
    };

    await getProfile(req, res, next);

    expect(authService.getUserProfile).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(BadRequestError);
  });
    it("ID-04: Should return 200 with user profile", async () => {
    req.headers = {
      authorization: "Bearer valid-token",
    };

    const mockProfile = {
      id: 1,
      username: "admin",
      role: "ADMIN",
    };

    (authService.getUserProfile as jest.Mock)
      .mockResolvedValue(mockProfile);

    await getProfile(req, res, next);

    expect(authService.getUserProfile)
      .toHaveBeenCalledWith("valid-token");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      profile: mockProfile,
    });

    expect(next).not.toHaveBeenCalled();
  });
    it("ID-05: Should call next when service throws error", async () => {
    req.headers = {
      authorization: "Bearer valid-token",
    };

    const mockError = new Error("Invalid token");

    (authService.getUserProfile as jest.Mock)
      .mockRejectedValue(mockError);

    await getProfile(req, res, next);

    expect(authService.getUserProfile)
      .toHaveBeenCalledWith("valid-token");

    expect(next).toHaveBeenCalledWith(mockError);
  });
});

