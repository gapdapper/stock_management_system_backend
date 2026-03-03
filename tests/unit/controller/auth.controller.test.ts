jest.mock("@/services/authService", () => ({
  loginUser: jest.fn(),
}));


import { type Request, type Response, type NextFunction } from "express";
import * as authService from "@/services/authService";
import { login } from "@/controllers/authController";

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

    await login(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

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

    await login(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockLoginUser).toHaveBeenCalledWith({
      username: "admin",
      password: "1234",
    });

    expect(mockRes.cookie).toHaveBeenCalledWith(
      "refreshToken",
      "mock-refresh",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "strict",
      })
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

    mockLoginUser.mockRejectedValue(
      new Error("Invalid credentials")
    );

    await login(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalled();
  });
});