jest.mock("@/repositories/dailyUploadLogRepository", () => ({
  updateDailyUploadLog: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/repositories/transactionRepository", () => ({
  findAllTransactions: jest.fn(),
  findTransactionById: jest.fn(),
  findTransactionByOrderId: jest.fn(),
  createManyTransactions: jest.fn(),
  createManyTransactionItems: jest.fn(),
  updateTransactionStatus: jest.fn(),
}));

jest.mock("@/repositories/productVariantRepository", () => ({
  findByProductIdAndAttributesId: jest.fn(),
  updateQuantityById: jest.fn(),
}));
jest.mock("xlsx");

import * as dailyUploadLogRepository from "@/repositories/dailyUploadLogRepository";
import * as transactionRepository from "@/repositories/transactionRepository";
import * as productVariantRepository from "@/repositories/productVariantRepository";
import {
  getTransactions,
  getTransactionById,
  processImportedTransactionFiles,
} from "@/services/transactionService";
import NotFoundError from "@/utils/errors/not-found";
import * as XLSX from "xlsx";

import * as helper from "@/utils/sheets/sheet";

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

    (transactionRepository.findAllTransactions as jest.Mock).mockResolvedValue(
      mockTransactions,
    );

    const result = await getTransactions();

    expect(transactionRepository.findAllTransactions).toHaveBeenCalledTimes(1);

    expect(result).toEqual(mockTransactions);
  });

  it("TC-02: should throw NotFoundError when repository returns null", async () => {
    (transactionRepository.findAllTransactions as jest.Mock).mockResolvedValue(
      null,
    );

    await expect(getTransactions()).rejects.toBeInstanceOf(NotFoundError);

    expect(transactionRepository.findAllTransactions).toHaveBeenCalledTimes(1);
  });

  it("TC-03: should propagate error when repository throws", async () => {
    const mockError = new Error("Database error");

    (transactionRepository.findAllTransactions as jest.Mock).mockRejectedValue(
      mockError,
    );

    await expect(getTransactions()).rejects.toThrow("Database error");

    expect(transactionRepository.findAllTransactions).toHaveBeenCalledTimes(1);
  });
});

// #region UTC-03-04
describe("UTC-03-04: getTransactionById()", () => {
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

  (transactionRepository.findTransactionById as jest.Mock)
    .mockResolvedValue(mockRepoData);

  const result = await getTransactionById(1);

  expect(transactionRepository.findTransactionById)
    .toHaveBeenCalledWith(1);

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
  (transactionRepository.findTransactionById as jest.Mock)
    .mockResolvedValue(null);

  await expect(getTransactionById(999))
    .rejects.toBeInstanceOf(NotFoundError);

  expect(transactionRepository.findTransactionById)
    .toHaveBeenCalledWith(999);
});

it("TC-03: should propagate error when repository throws", async () => {
  const mockError = new Error("Database error");

  (transactionRepository.findTransactionById as jest.Mock)
    .mockRejectedValue(mockError);

  await expect(getTransactionById(1))
    .rejects.toThrow("Database error");

  expect(transactionRepository.findTransactionById)
    .toHaveBeenCalledWith(1);
});
});

// #region UTC-04-03

const SHOPEE_HEADERS = [
  "หมายเลขคำสั่งซื้อ",
  "ชื่อผู้ใช้ (ผู้ซื้อ)",
  "ช่องทางการชำระเงิน",
  "รหัสไปรษณีย์",
  "สถานะการสั่งซื้อ",
  "สถานะการคืนเงินหรือคืนสินค้า",
  "ชื่อสินค้า",
  "ชื่อตัวเลือก",
  "จำนวน",
];

const baseRow = {
  หมายเลขคำสั่งซื้อ: "ORD001",
  "ชื่อผู้ใช้ (ผู้ซื้อ)": "Test",
  ช่องทางการชำระเงิน: "COD",
  รหัสไปรษณีย์: "10100",
  สถานะการสั่งซื้อ: "สำเร็จแล้ว",
  สถานะการคืนเงินหรือคืนสินค้า: "",
  ชื่อสินค้า: "Jenga",
  ชื่อตัวเลือก: "Red",
  จำนวน: "1",
};

// #region UTC-04-03
describe("UTC-04-03: processImportedTransactionFiles()", () => {
  const mockFile: Express.Multer.File = {
    fieldname: "file",
    originalname: "test.csv",
    encoding: "7bit",
    mimetype: "text/csv",
    buffer: Buffer.from("mock"),
    size: 100,
    destination: "",
    filename: "",
    path: "",
    stream: undefined as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    jest.spyOn(helper, "platformMapper").mockReturnValue({
      id: 1,
      productPattern: [],
    });

    jest.spyOn(helper, "lookupPaymentTypeId").mockReturnValue(1);

    jest.spyOn(helper, "statusMapper").mockReturnValue("completed");
  });

  it("ID-01: Verify that the system throws BadRequestError when files input is empty", async () => {
    await expect(processImportedTransactionFiles([])).rejects.toThrow(
      "transaction file is required",
    );
  });

  it("ID-02: Verify that the system processes a valid transaction file and inserts transactions successfully", async () => {
    const workbook = {
      SheetNames: ["Sheet1"],
      Sheets: { Sheet1: {} },
    };

    (XLSX.read as jest.Mock).mockReturnValue(workbook);

    jest
      .spyOn(XLSX.utils, "sheet_to_json")
      .mockReturnValueOnce([SHOPEE_HEADERS])
      .mockReturnValueOnce([{ ...baseRow, จำนวน: "2" }]);

    jest.spyOn(helper, "resolveVariant").mockResolvedValue({
      productId: 1,
      productVariantId: 10,
      rawVariant: "test variant",
    });

    (
      productVariantRepository.findByProductIdAndAttributesId as jest.Mock
    ).mockResolvedValue({ id: 10 });

    (
      transactionRepository.findTransactionByOrderId as jest.Mock
    ).mockResolvedValue([]);

    (
      transactionRepository.createManyTransactions as jest.Mock
    ).mockResolvedValue([{ orderId: "ORD001", insertedId: 1 }]);

    await processImportedTransactionFiles([mockFile]);

    expect(transactionRepository.createManyTransactions).toHaveBeenCalled();
  });

  it("ID-03: Verify that the system skips rows when productId cannot be detected", async () => {
    const workbook = {
      SheetNames: ["Sheet1"],
      Sheets: { Sheet1: {} },
    };

    (XLSX.read as jest.Mock).mockReturnValue(workbook);

    jest
      .spyOn(XLSX.utils, "sheet_to_json")
      .mockReturnValueOnce([SHOPEE_HEADERS])
      .mockReturnValueOnce([{ ...baseRow, ชื่อสินค้า: "Unknown Product" }]);

    jest.spyOn(helper, "resolveVariant").mockResolvedValue(null);

    await processImportedTransactionFiles([mockFile]);

    expect(transactionRepository.createManyTransactions).not.toHaveBeenCalled();
  });

  it("ID-04: Verify that the system updates transaction status when orderId already exists", async () => {
    const workbook = {
      SheetNames: ["Sheet1"],
      Sheets: { Sheet1: {} },
    };

    (XLSX.read as jest.Mock).mockReturnValue(workbook);

    jest
      .spyOn(XLSX.utils, "sheet_to_json")
      .mockReturnValueOnce([SHOPEE_HEADERS])
      .mockReturnValueOnce([baseRow]);

    jest.spyOn(helper, "resolveVariant").mockResolvedValue({
      productId: 1,
      productVariantId: 10,
      rawVariant: "test variant",
    });

    (
      transactionRepository.findTransactionByOrderId as jest.Mock
    ).mockResolvedValue([{ orderId: "ORD001", status: "order placed" }]);

    await processImportedTransactionFiles([mockFile]);

    expect(transactionRepository.updateTransactionStatus).toHaveBeenCalled();
  });

  it("ID-05: Verify that the system updates product variant stock quantity after successful import", async () => {
    const workbook = {
      SheetNames: ["Sheet1"],
      Sheets: { Sheet1: {} },
    };

    (XLSX.read as jest.Mock).mockReturnValue(workbook);

    jest
      .spyOn(XLSX.utils, "sheet_to_json")
      .mockReturnValueOnce([SHOPEE_HEADERS])
      .mockReturnValueOnce([{ ...baseRow, จำนวน: "2" }]);

    jest.spyOn(helper, "resolveVariant").mockResolvedValue({
      productId: 1,
      productVariantId: 10,
      rawVariant: "mock",
    });

    (
      productVariantRepository.findByProductIdAndAttributesId as jest.Mock
    ).mockResolvedValue({ id: 10 });

    (
      transactionRepository.findTransactionByOrderId as jest.Mock
    ).mockResolvedValue([]);

    (
      transactionRepository.createManyTransactions as jest.Mock
    ).mockResolvedValue([{ orderId: "ORD001", insertedId: 1 }]);

    await processImportedTransactionFiles([mockFile]);

    expect(productVariantRepository.updateQuantityById).toHaveBeenCalled();
  });
});
