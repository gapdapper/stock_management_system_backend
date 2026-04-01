jest.mock("@/services/transactionService", () => ({
  getTransactions: jest.fn(),
  getTransactionById: jest.fn(),
  processImportedTransactionFiles: jest.fn(),
}));

import { type Request, type Response, type NextFunction } from "express";
import * as transactionService from "@/services/transactionService";
import { getTransaction, getTransactionById, importTransactions } from "@/controllers/transactionController";

// #region UTC-03-01
describe("UTC-03-01: getTransaction()", () => {
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

  it("ID-01: should return 200 and transactions when service resolves", async () => {
    const mockData = [
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

    (transactionService.getTransactions as jest.Mock).mockResolvedValue(mockData);

    await getTransaction(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(transactionService.getTransactions).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      transactions: mockData,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("ID-02: should return 200 and empty array when no transactions exist", async () => {
  (transactionService.getTransactions as jest.Mock).mockResolvedValue([]);

  await getTransaction(
    mockReq as Request,
    mockRes as Response,
    mockNext
  );

  expect(transactionService.getTransactions).toHaveBeenCalledTimes(1);
  expect(mockRes.status).toHaveBeenCalledWith(200);
  expect(mockRes.json).toHaveBeenCalledWith({
    transactions: [],
  });
  expect(mockNext).not.toHaveBeenCalled();
});

  it("ID-03: should call next(error) when service throws error", async () => {
    const mockError = new Error("Database failed");

    (transactionService.getTransactions as jest.Mock).mockRejectedValue(mockError);

    await getTransaction(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(transactionService.getTransactions).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
  });
});

// #region UTC-03-02
describe("UTC-03-02: getTransactionById()", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("TC-01: should return 400 when transactionId is missing", async () => {
    mockReq = {
      params: {},
    };

    await getTransactionById(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Invalid transactionId",
    });

    expect(transactionService.getTransactionById).not.toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("TC-02: should return 200 with transaction when service resolves", async () => {
    const mockResult = {
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
      ],
    };

    mockReq = {
      params: { id: "1" },
    };

    (transactionService.getTransactionById as jest.Mock)
      .mockResolvedValue(mockResult);

    await getTransactionById(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(transactionService.getTransactionById)
      .toHaveBeenCalledWith(1);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      transaction: mockResult,
    });

    expect(mockNext).not.toHaveBeenCalled();
  });

  it("TC-03: should call next(error) when service throws", async () => {
    const mockError = new Error("Database error");

    mockReq = {
      params: { id: "1" },
    };

    (transactionService.getTransactionById as jest.Mock)
      .mockRejectedValue(mockError);

    await getTransactionById(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(transactionService.getTransactionById)
      .toHaveBeenCalledWith(1);

    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
  });
});

// #region UTC-04-01
describe("UTC-04-01: importTransactions()", () => {
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

  it("ID-01: Should return 400 when no files uploaded", async () => {
    mockReq.files = [];

    await importTransactions(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "No files uploaded",
    });

    expect(transactionService.processImportedTransactionFiles)
      .not.toHaveBeenCalled();
  });

  it("ID-02: Should process files and return 200", async () => {
    const mockFiles = [
      {
        originalname: "test.csv",
        buffer: Buffer.from("test"),
      },
    ] as Express.Multer.File[];

    mockReq.files = mockFiles;


    (transactionService.processImportedTransactionFiles as jest.Mock)
      .mockResolvedValue([
        { orderId: "ORD001", insertedId: 1 }
      ]);
    await importTransactions(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(transactionService.processImportedTransactionFiles)
      .toHaveBeenCalledWith(mockFiles);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      result: [{ orderId: "ORD001", insertedId: 1 }],
    });
  });

  it("ID-03: Should call next(error) when service throws error", async () => {
    const mockFiles = [
      {
        originalname: "fail.csv",
        buffer: Buffer.from("fail"),
      },
    ] as Express.Multer.File[];

    const mockError = new Error("Import failed");

    mockReq.files = mockFiles;

    (
      transactionService.processImportedTransactionFiles as jest.Mock
    ).mockRejectedValue(mockError);

    await importTransactions(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);

    expect(mockRes.status).not.toHaveBeenCalledWith(200);
  });
});