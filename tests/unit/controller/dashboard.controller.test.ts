jest.mock("@/services/dashboardService", () => ({
  getDashboardStats: jest.fn(),
  getAvailableMonths: jest.fn(),
}));

import { getDashboardOverview, getAvailableMonths } from "@/controllers/dashboardController";
import * as dashboardService from "@/services/dashboardService";
import type { Request, Response, NextFunction } from "express";


// #region UTC-02-01
describe("UTC-02-01: getDashboardOverview()", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      params: {},
    };

    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    mockResponse = res as Response;

    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  it("should return 200 and overview data when month is provided", async () => {
    const mockResults = {
      totalOrders: 100,
      unitsSold: 250,
      avgItemsPerOrder: 2.5,
      topItems: [
        {
          totalSold: 50,
          productId: 1,
          productName: "Product A",
        },
      ],
      salesByPlatform: [
        {
          platform: "Shopee",
          total: 15000,
        },
      ],
      salesByStatus: [
        {
          status: "completed",
          count: 80,
        },
      ],
    };

    mockRequest.params = { month: "2026-02" };

    (dashboardService.getDashboardStats as jest.Mock).mockResolvedValue(
      mockResults
    );

    await getDashboardOverview(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(dashboardService.getDashboardStats).toHaveBeenCalledWith("2026-02");
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      overview: mockResults,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next with error when month is not provided", async () => {
    mockRequest.params = {}; // no month

    await getDashboardOverview(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(
      new Error("No month provided")
    );
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("should call next when service throws error", async () => {
    mockRequest.params = { month: "2026-02" };

    const mockError = new Error("Service failure");

    (dashboardService.getDashboardStats as jest.Mock).mockRejectedValue(
      mockError
    );

    await getDashboardOverview(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(dashboardService.getDashboardStats).toHaveBeenCalledWith("2026-02");
    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });
});

// #region UTC-02-02
describe("UTC-02-02: getAvailableMonths()", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};

    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    mockResponse = res as Response;
    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  it("should return 200 and available months", async () => {
    const mockMonths = ["2026-01", "2026-02", "2026-03"];

    (dashboardService.getAvailableMonths as jest.Mock).mockResolvedValue(
      mockMonths
    );

    await getAvailableMonths(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(dashboardService.getAvailableMonths).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      availableMonths: mockMonths,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next when service throws error", async () => {
    const mockError = new Error("Service failure");

    (dashboardService.getAvailableMonths as jest.Mock).mockRejectedValue(
      mockError
    );

    await getAvailableMonths(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(dashboardService.getAvailableMonths).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });
});