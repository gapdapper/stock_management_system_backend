// ==============================
// Mock Section
// ==============================

jest.mock("@/services/dailyUploadLogService", () => ({
  getUploadLog: jest.fn(),
}));

import { type Request, type Response, type NextFunction } from "express";
import * as dailyUploadLogService from "@/services/dailyUploadLogService";
import { getUploadLog } from "@/controllers/dailyUploadLogController";

// #region UTC-04-02
describe("UTC-04-02: getUploadLog()", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("ID-01: Should return upload log when data exists", async () => {
    const mockResult = {
      id: 1,
      uploadAt: new Date("2026-03-04"),
    };

    (dailyUploadLogService.getUploadLog as jest.Mock)
      .mockResolvedValue(mockResult);

    await getUploadLog(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(dailyUploadLogService.getUploadLog)
      .toHaveBeenCalled();

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      uploadLog: mockResult,
    });
  });

  it("ID-02: Should return undefined when no upload log", async () => {
    (dailyUploadLogService.getUploadLog as jest.Mock)
      .mockResolvedValue(undefined);

    await getUploadLog(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      uploadLog: undefined,
    });
  });

  it("ID-03: Should call next(error) when service throws error", async () => {
    const mockError = new Error("Database error");

    (dailyUploadLogService.getUploadLog as jest.Mock)
      .mockRejectedValue(mockError);

    await getUploadLog(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockRes.status).not.toHaveBeenCalledWith(200);
  });
});

// #region UTC-04-03
