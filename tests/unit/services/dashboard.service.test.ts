jest.mock("@/repositories/transactionRepository", () => ({
  countOrders: jest.fn(),
  sumUnitsSold: jest.fn(),
  topSoldProducts: jest.fn(),
  salesByPlatform: jest.fn(),
  getOrderStatusBreakdown: jest.fn(),
  findAllTransactions: jest.fn(),
}));


import { getDashboardStats, getAvailableMonths } from "@/services/dashboardService";
import * as transactionRepository from "@/repositories/transactionRepository";
import BadRequestError from "@/utils/errors/bad-request";

const mockedRepo =
  transactionRepository as jest.Mocked<typeof transactionRepository>;

// #region UTC-02-03
describe("UTC-02-03: getDashboardStats()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw BadRequestError when month is empty", async () => {
    await expect(getDashboardStats("" as any)).rejects.toBeInstanceOf(
      BadRequestError
    );
  });

  it("should return zero summary when totalOrders is 0", async () => {
    mockedRepo.countOrders.mockResolvedValue([{ count: 0 }]);
    mockedRepo.sumUnitsSold.mockResolvedValue([{ total: 0 }]);
    mockedRepo.topSoldProducts.mockResolvedValue([]);
    mockedRepo.salesByPlatform.mockResolvedValue([]);
    mockedRepo.getOrderStatusBreakdown.mockResolvedValue([]);

    const result = await getDashboardStats("2026-02");

    expect(result).toEqual({
      totalOrders: 0,
      unitsSold: 0,
      avgItemsPerOrder: 0,
      topItems: [],
      salesByPlatform: [],
      salesByStatus: [],
    });
  });

  it("should return computed dashboard stats", async () => {
    mockedRepo.countOrders.mockResolvedValue([{ count: 10 }]);
    mockedRepo.sumUnitsSold.mockResolvedValue([{ total: 25 }]);

    mockedRepo.topSoldProducts.mockResolvedValue([
      { productId: 1, productName: "Product A", totalSold: 5 },
    ]);

    mockedRepo.salesByPlatform.mockResolvedValue([
      { platform: "Shopee", total: 15000 },
    ]);

    mockedRepo.getOrderStatusBreakdown.mockResolvedValue([
      { status: "completed", count: 8 },
    ]);

    const result = await getDashboardStats("2026-02");

    expect(result).toEqual({
      totalOrders: 10,
      unitsSold: 25,
      avgItemsPerOrder: 2.5,
      topItems: [
        { productId: 1, productName: "Product A", totalSold: 5 },
      ],
      salesByPlatform: [
        { platform: "Shopee", total: 15000 },
      ],
      salesByStatus: [
        { status: "completed", count: 8 },
      ],
    });
  });

  it("should rethrow error when repository fails", async () => {
    const mockError = new Error("DB failure");
    mockedRepo.countOrders.mockRejectedValue(mockError);

    await expect(getDashboardStats("2026-02")).rejects.toThrow(
      "DB failure"
    );
  });
});

// #region UTC-02-04
describe("UTC-02-04: getAvailableMonths()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should extract unique months and return sorted result", async () => {
    mockedRepo.findAllTransactions.mockResolvedValue([
      {
        id: 1,
        orderId: "ORD-1",
        buyer: "John",
        status: "completed",
        createdAt: new Date("2026-02-10"),
        updatedAt: new Date(),
        paymentType: null,
        platform: null,
        note: null,
      },
      {
        id: 2,
        orderId: "ORD-2",
        buyer: "Jane",
        status: "completed",
        createdAt: new Date("2026-01-05"),
        updatedAt: new Date(),
        paymentType: null,
        platform: null,
        note: null,
      },
      {
        id: 3,
        orderId: "ORD-3",
        buyer: "Mark",
        status: "completed",
        createdAt: new Date("2026-02-20"),
        updatedAt: new Date(),
        paymentType: null,
        platform: null,
        note: null,
      },
    ]);

    const result = await getAvailableMonths();

    expect(result).toEqual(["2026-1", "2026-2"]);
  });

  it("should ignore transactions with null createdAt", async () => {
    mockedRepo.findAllTransactions.mockResolvedValue([
      {
        id: 1,
        orderId: "ORD-1",
        buyer: null,
        status: "completed",
        createdAt: null,
        updatedAt: new Date(),
        paymentType: null,
        platform: null,
        note: null,
      },
    ]);

    const result = await getAvailableMonths();

    expect(result).toEqual([]);
  });

  it("should rethrow error when repository fails", async () => {
    const mockError = new Error("DB failure");
    mockedRepo.findAllTransactions.mockRejectedValue(mockError);

    await expect(getAvailableMonths()).rejects.toThrow("DB failure");
  });
});