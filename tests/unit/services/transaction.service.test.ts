jest.mock("@/repositories/dailyUploadLogRepository", () => ({
  updateDailyUploadLog: jest.fn(),
}));

jest.mock("@/repositories/transactionRepository", () => ({
  findAllTransactions: jest.fn(),
  findTransactionByOrderId: jest.fn(),
}));

import * as dailyUploadLogRepository from "@/repositories/dailyUploadLogRepository";
import * as transactionRepository from "@/repositories/transactionRepository";
import { getTransactions, getTransactionByOrderId } from "@/services/transactionService";
import NotFoundError from "@/utils/errors/not-found";

// #region UTC-03-03
describe("UTC-03-03: getTransactions()", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("TC-01: should return transactions when repository returns data", async () => {
    const mockTransactions = [
      {
        id: 1,
        orderId: "ORD001",
        buyer: "John",
        status: "completed",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
        paymentType: "credit card",
        platform: "Shopee",
        note: null,
      },
    ];

    (transactionRepository.findAllTransactions as jest.Mock)
      .mockResolvedValue(mockTransactions);

    const result = await getTransactions();

    expect(dailyUploadLogRepository.updateDailyUploadLog)
      .toHaveBeenCalledTimes(1);

    expect(transactionRepository.findAllTransactions)
      .toHaveBeenCalledTimes(1);

    expect(result).toEqual(mockTransactions);
  });

  it("TC-02: should throw NotFoundError when repository returns null", async () => {
    (transactionRepository.findAllTransactions as jest.Mock)
      .mockResolvedValue(null);

    await expect(getTransactions()).rejects.toBeInstanceOf(NotFoundError);

    expect(dailyUploadLogRepository.updateDailyUploadLog)
      .toHaveBeenCalledTimes(1);

    expect(transactionRepository.findAllTransactions)
      .toHaveBeenCalledTimes(1);
  });

  it("TC-03: should propagate error when repository throws", async () => {
    const mockError = new Error("Database error");

    (transactionRepository.findAllTransactions as jest.Mock)
      .mockRejectedValue(mockError);

    await expect(getTransactions()).rejects.toThrow("Database error");

    expect(dailyUploadLogRepository.updateDailyUploadLog)
      .toHaveBeenCalledTimes(1);

    expect(transactionRepository.findAllTransactions)
      .toHaveBeenCalledTimes(1);
  });
});

// #region UTC-03-04
describe("UTC-03-04: getTransactionByOrderId()", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("TC-01: should return grouped transaction object when data exists", async () => {
    const mockRepoData = [
      {
        orderId: "ORD001",
        buyer: "John",
        status: "completed",
        createdAt: new Date("2024-01-01"),
        paymentType: "credit card",
        platform: "Shopee",
        variantId: 1,
        productName: "T-Shirt",
        size: "Size M",
        color: "Black",
        quantity: 2,
      },
      {
        orderId: "ORD001",
        buyer: "John",
        status: "completed",
        createdAt: new Date("2024-01-01"),
        paymentType: "credit card",
        platform: "Shopee",
        variantId: 2,
        productName: "T-Shirt",
        size: "Size L",
        color: "White",
        quantity: 1,
      },
    ];

    (transactionRepository.findTransactionByOrderId as jest.Mock)
      .mockResolvedValue(mockRepoData);

    const result = await getTransactionByOrderId("ORD001");

    expect(transactionRepository.findTransactionByOrderId)
      .toHaveBeenCalledWith("ORD001");

    expect(result).toEqual({
      orderId: "ORD001",
      buyer: "John",
      status: "completed",
      createdAt: new Date("2024-01-01"),
      paymentType: "credit card",
      platform: "Shopee",
      items: [
        {
          variantId: 1,
          productName: "T-Shirt",
          size: "Size M",
          color: "Black",
          quantity: 2,
        },
        {
          variantId: 2,
          productName: "T-Shirt",
          size: "Size L",
          color: "White",
          quantity: 1,
        },
      ],
    });
  });

  it("TC-02: should throw NotFoundError when repository returns null", async () => {
    (transactionRepository.findTransactionByOrderId as jest.Mock)
      .mockResolvedValue(null);

    await expect(
      getTransactionByOrderId("ORD999")
    ).rejects.toBeInstanceOf(NotFoundError);

    expect(transactionRepository.findTransactionByOrderId)
      .toHaveBeenCalledWith("ORD999");
  });

  it("TC-03: should propagate error when repository throws", async () => {
    const mockError = new Error("Database error");

    (transactionRepository.findTransactionByOrderId as jest.Mock)
      .mockRejectedValue(mockError);

    await expect(
      getTransactionByOrderId("ORD001")
    ).rejects.toThrow("Database error");

    expect(transactionRepository.findTransactionByOrderId)
      .toHaveBeenCalledWith("ORD001");
  });
});

// #region UTC-04-03
