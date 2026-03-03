const mockSelect = jest.fn();
const mockSelectDistinctOn = jest.fn();
const mockFrom = jest.fn();
const mockInnerJoin = jest.fn();
const mockWhere = jest.fn();
const mockLeftJoin = jest.fn();
const mockGroupBy = jest.fn();
const mockOrderBy = jest.fn();
const mockLimit = jest.fn();
const mockInnerJoin1 = jest.fn();
const mockInnerJoin2 = jest.fn();
const mockUpdate = jest.fn();
const mockSet = jest.fn();
const mockReturning = jest.fn();
const mockInsert = jest.fn();
const mockValues = jest.fn();

jest.mock("@/db/connect", () => ({
  __esModule: true,
  default: {
    select: mockSelect,
    selectDistinctOn: mockSelectDistinctOn,
    update: mockUpdate,
    insert: mockInsert,
  },
}));


import db from "@/db/connect";
import { countOrders, sumUnitsSold, topSoldProducts, salesByPlatform, getOrderStatusBreakdown, findAllTransactions, findTransactionByOrderId, updateTransactionStatus, createManyTransactions, createManyTransactionItems } from "@/repositories/transactionRepository";

// #region UTC-02-05
describe("UTC-02-05: countOrders()", () => {
  const start = new Date("2025-01-01");
  const end = new Date("2025-02-01");

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("ID-01: Return count when data exists", async () => {
    // Arrange
    const mockResult = [{ count: 5 }];

    mockWhere.mockResolvedValue(mockResult);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    // Act
    const result = await countOrders(start, end);

    // Assert
    expect(mockSelect).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalled();
    expect(mockWhere).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });

  it("ID-02: Return count = 0 when no data in range", async () => {
    // Arrange
    const mockResult = [{ count: 0 }];

    mockWhere.mockResolvedValue(mockResult);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    // Act
    const result = await countOrders(start, end);

    // Assert
    expect(result).toEqual(mockResult);
  });

  it("ID-03: Throw error when database fails", async () => {
    // Arrange
    const mockError = new Error("DB Error");

    mockWhere.mockRejectedValue(mockError);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    // Act & Assert
    await expect(countOrders(start, end)).rejects.toThrow("DB Error");
  });
});

// #region UTC-02-06
describe("UTC-02-06: sumUnitsSold()", () => {
  const start = new Date("2025-01-01");
  const end = new Date("2025-02-01");

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("ID-01: Return total when data exists", async () => {
    // Arrange
    const mockResult = [{ total: 120 }];

    mockWhere.mockResolvedValue(mockResult);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    // Act
    const result = await sumUnitsSold(start, end);

    // Assert
    expect(mockSelect).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalled();
    expect(mockWhere).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });

  it("ID-02: Return null when no data exists (sum returns null)", async () => {
    const mockResult = [{ total: null }];

    mockWhere.mockResolvedValue(mockResult);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    const result = await sumUnitsSold(start, end);

    expect(result).toEqual(mockResult);
  });

  it("ID-03: Throw error when database fails", async () => {
    const mockError = new Error("DB Error");

    mockWhere.mockRejectedValue(mockError);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    await expect(sumUnitsSold(start, end)).rejects.toThrow("DB Error");
  });
});

// #region UTC-02-07
describe("UTC-TRXITEM-02: topSoldProducts()", () => {
  const start = new Date("2025-01-01");
  const end = new Date("2025-02-01");

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("ID-01: Return top 5 sold products when data exists", async () => {
    // Arrange
    const mockResult = [
      { productId: 1, productName: "Product A", totalSold: 50 },
      { productId: 2, productName: "Product B", totalSold: 40 },
    ];

    mockLimit.mockResolvedValue(mockResult);
    mockOrderBy.mockReturnValue({ limit: mockLimit });
    mockGroupBy.mockReturnValue({ orderBy: mockOrderBy });
    mockWhere.mockReturnValue({ groupBy: mockGroupBy });
    mockInnerJoin.mockReturnValue({ where: mockWhere });
    mockFrom.mockReturnValue({ innerJoin: mockInnerJoin });
    mockSelect.mockReturnValue({ from: mockFrom });

    // Act
    const result = await topSoldProducts(start, end);

    // Assert
    expect(mockSelect).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalled();
    expect(mockInnerJoin).toHaveBeenCalled();
    expect(mockWhere).toHaveBeenCalled();
    expect(mockGroupBy).toHaveBeenCalled();
    expect(mockOrderBy).toHaveBeenCalled();
    expect(mockLimit).toHaveBeenCalledWith(5);

    expect(result).toEqual(mockResult);
  });

  it("ID-02: Return empty array when no data in range", async () => {
    const mockResult: any[] = [];

    mockLimit.mockResolvedValue(mockResult);
    mockOrderBy.mockReturnValue({ limit: mockLimit });
    mockGroupBy.mockReturnValue({ orderBy: mockOrderBy });
    mockWhere.mockReturnValue({ groupBy: mockGroupBy });
    mockInnerJoin.mockReturnValue({ where: mockWhere });
    mockFrom.mockReturnValue({ innerJoin: mockInnerJoin });
    mockSelect.mockReturnValue({ from: mockFrom });

    const result = await topSoldProducts(start, end);

    expect(result).toEqual([]);
  });

  it("ID-03: Throw error when database fails", async () => {
    const mockError = new Error("DB Error");

    mockLimit.mockRejectedValue(mockError);
    mockOrderBy.mockReturnValue({ limit: mockLimit });
    mockGroupBy.mockReturnValue({ orderBy: mockOrderBy });
    mockWhere.mockReturnValue({ groupBy: mockGroupBy });
    mockInnerJoin.mockReturnValue({ where: mockWhere });
    mockFrom.mockReturnValue({ innerJoin: mockInnerJoin });
    mockSelect.mockReturnValue({ from: mockFrom });

    await expect(topSoldProducts(start, end)).rejects.toThrow("DB Error");
  });
});

// #region UTC-02-08
describe("UTC-TRX-02: salesByPlatform()", () => {
  const start = new Date("2025-01-01");
  const end = new Date("2025-02-01");

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("ID-01: Return grouped sales by platform when data exists", async () => {
    // Arrange
    const mockResult = [
      { platform: "Shopee", total: 10 },
      { platform: "Lazada", total: 5 },
    ];

    mockGroupBy.mockResolvedValue(mockResult);
    mockWhere.mockReturnValue({ groupBy: mockGroupBy });
    mockLeftJoin.mockReturnValue({ where: mockWhere });
    mockFrom.mockReturnValue({ leftJoin: mockLeftJoin });
    mockSelect.mockReturnValue({ from: mockFrom });

    // Act
    const result = await salesByPlatform(start, end);

    // Assert
    expect(mockSelect).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalled();
    expect(mockLeftJoin).toHaveBeenCalled();
    expect(mockWhere).toHaveBeenCalled();
    expect(mockGroupBy).toHaveBeenCalled();

    expect(result).toEqual(mockResult);
  });

  it("ID-02: Return empty array when no sales found", async () => {
    const mockResult: any[] = [];

    mockGroupBy.mockResolvedValue(mockResult);
    mockWhere.mockReturnValue({ groupBy: mockGroupBy });
    mockLeftJoin.mockReturnValue({ where: mockWhere });
    mockFrom.mockReturnValue({ leftJoin: mockLeftJoin });
    mockSelect.mockReturnValue({ from: mockFrom });

    const result = await salesByPlatform(start, end);

    expect(result).toEqual([]);
  });

  it("ID-03: Throw error when database fails", async () => {
    const mockError = new Error("DB Error");

    mockGroupBy.mockRejectedValue(mockError);
    mockWhere.mockReturnValue({ groupBy: mockGroupBy });
    mockLeftJoin.mockReturnValue({ where: mockWhere });
    mockFrom.mockReturnValue({ leftJoin: mockLeftJoin });
    mockSelect.mockReturnValue({ from: mockFrom });

    await expect(salesByPlatform(start, end)).rejects.toThrow("DB Error");
  });
});

// #region UTC-02-09
describe("UTC-TRX-03: getOrderStatusBreakdown()", () => {
  const start = new Date("2025-01-01");
  const end = new Date("2025-02-01");

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("ID-01: Return grouped order status breakdown when data exists", async () => {
    // Arrange
    const mockResult = [
      { status: "COMPLETED", count: 10 },
      { status: "PENDING", count: 5 },
    ];

    mockGroupBy.mockResolvedValue(mockResult);
    mockWhere.mockReturnValue({ groupBy: mockGroupBy });
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    // Act
    const result = await getOrderStatusBreakdown(start, end);

    // Assert
    expect(mockSelect).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalled();
    expect(mockWhere).toHaveBeenCalled();
    expect(mockGroupBy).toHaveBeenCalled();

    expect(result).toEqual(mockResult);
  });

  it("ID-02: Return empty array when no data found", async () => {
    const mockResult: any[] = [];

    mockGroupBy.mockResolvedValue(mockResult);
    mockWhere.mockReturnValue({ groupBy: mockGroupBy });
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    const result = await getOrderStatusBreakdown(start, end);

    expect(result).toEqual([]);
  });

  it("ID-03: Throw error when database fails", async () => {
    const mockError = new Error("DB Error");

    mockGroupBy.mockRejectedValue(mockError);
    mockWhere.mockReturnValue({ groupBy: mockGroupBy });
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    await expect(getOrderStatusBreakdown(start, end)).rejects.toThrow(
      "DB Error",
    );
  });
});

// #region UTC-02-10 & UTC-03-05
describe("UTC-02-10 & UTC-03-05: findAllTransactions()", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("ID-01: Return transactions when data exists", async () => {
    // Arrange
    const mockResult = [
      {
        id: 1,
        orderId: "ORD-001",
        buyer: "John",
        status: "COMPLETED",
        createdAt: new Date(),
        updatedAt: new Date(),
        paymentType: "COD",
        platform: "Shopee",
        note: "Fast delivery",
      },
    ];

    mockOrderBy.mockResolvedValue(mockResult);
    mockInnerJoin2.mockReturnValue({ orderBy: mockOrderBy });
    mockInnerJoin1.mockReturnValue({ innerJoin: mockInnerJoin2 });
    mockFrom.mockReturnValue({ innerJoin: mockInnerJoin1 });
    mockSelectDistinctOn.mockReturnValue({ from: mockFrom });

    // Act
    const result = await findAllTransactions();

    // Assert
    expect(mockSelectDistinctOn).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalled();
    expect(mockInnerJoin1).toHaveBeenCalled();
    expect(mockInnerJoin2).toHaveBeenCalled();
    expect(mockOrderBy).toHaveBeenCalled();

    expect(result).toEqual(mockResult);
  });

  it("ID-02: Throw error when result is null", async () => {
    mockOrderBy.mockResolvedValue(null);
    mockInnerJoin2.mockReturnValue({ orderBy: mockOrderBy });
    mockInnerJoin1.mockReturnValue({ innerJoin: mockInnerJoin2 });
    mockFrom.mockReturnValue({ innerJoin: mockInnerJoin1 });
    mockSelectDistinctOn.mockReturnValue({ from: mockFrom });

    await expect(findAllTransactions()).rejects.toThrow(
      "Failed to get transaction",
    );
  });

  it("ID-03: Throw error when database fails", async () => {
    const mockError = new Error("DB Error");

    mockOrderBy.mockRejectedValue(mockError);
    mockInnerJoin2.mockReturnValue({ orderBy: mockOrderBy });
    mockInnerJoin1.mockReturnValue({ innerJoin: mockInnerJoin2 });
    mockFrom.mockReturnValue({ innerJoin: mockInnerJoin1 });
    mockSelectDistinctOn.mockReturnValue({ from: mockFrom });

    await expect(findAllTransactions()).rejects.toThrow("DB Error");
  });
});


beforeEach(() => {
  jest.clearAllMocks();

  mockSelect.mockReturnValue({
    from: mockFrom,
  });

  mockFrom.mockReturnValue({
    innerJoin: mockInnerJoin,
  });

  // chain innerJoin หลายครั้งให้ return ตัวเอง
  mockInnerJoin.mockReturnValue({
    innerJoin: mockInnerJoin,
    where: mockWhere,
  });
});

// #region UTC-03-06 & UTC-04-05
describe("UTC-03-06 & UTC-04-05: findTransactionByOrderId()", () => {

  it("TC-01: should return transaction rows when query succeeds", async () => {
    const mockData = [
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
    ];

    mockWhere.mockResolvedValue(mockData);

    const result = await findTransactionByOrderId("ORD001");

    expect(db.select).toHaveBeenCalledTimes(1);
    expect(mockFrom).toHaveBeenCalledTimes(1);
    expect(mockInnerJoin).toHaveBeenCalled();
    expect(mockWhere).toHaveBeenCalledTimes(1);

    expect(result).toEqual(mockData);
  });

  it("TC-02: should return empty array when no rows found", async () => {
    mockWhere.mockResolvedValue([]);

    const result = await findTransactionByOrderId("ORD999");

    expect(result).toEqual([]);
  });

  it("TC-03: should propagate error when query fails", async () => {
    const mockError = new Error("Database error");

    mockWhere.mockRejectedValue(mockError);

    await expect(
      findTransactionByOrderId("ORD001")
    ).rejects.toThrow("Database error");
  });
});

// #region UTC-04-06
describe("UTC-04-06: updateTransactionStatus()", () => {
  const orderId = "ORD-001";
  const status = "PAID" as any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUpdate.mockReturnValue({
      set: mockSet,
    });

    mockSet.mockReturnValue({
      where: mockWhere,
    });

    mockWhere.mockReturnValue({
      returning: mockReturning,
    });
  });

  it("ID-01: Should update status and return updated row", async () => {
    const mockResult = [
      {
        orderId: "ORD-001",
        status: "PAID",
      },
    ];

    mockReturning.mockResolvedValue(mockResult);

    const result = await updateTransactionStatus(orderId, status);

    expect(mockUpdate).toHaveBeenCalled();
    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        status: status,
        updatedAt: expect.any(Date),
      }),
    );
    expect(mockWhere).toHaveBeenCalled();
    expect(mockReturning).toHaveBeenCalled();

    expect(result).toEqual(mockResult);
  });

  it("ID-02: Should return empty array if no transaction updated", async () => {
    mockReturning.mockResolvedValue([]);

    const result = await updateTransactionStatus(orderId, status);

    expect(result).toEqual([]);
  });

  it("ID-03: Should throw error when database fails", async () => {
    mockReturning.mockRejectedValue(new Error("Database error"));

    await expect(updateTransactionStatus(orderId, status))
      .rejects
      .toThrow("Database error");
  });
});

// #region UTC-04-07
describe("UTC-04-07: createManyTransactions()", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockInsert.mockReturnValue({
      values: mockValues,
    });

    mockValues.mockReturnValue({
      returning: mockReturning,
    });
  });

  it("ID-01: Should insert transactions and return inserted data", async () => {
    const input = [
      { orderId: "ORD-001", buyer: "John" },
      { orderId: "ORD-002", buyer: "Jane" },
    ];

    const mockResult = [
      { insertedId: 1, orderId: "ORD-001" },
      { insertedId: 2, orderId: "ORD-002" },
    ];

    mockReturning.mockResolvedValue(mockResult);

    const result = await createManyTransactions(input);

    expect(mockInsert).toHaveBeenCalled();
    expect(mockValues).toHaveBeenCalledWith(input);
    expect(mockReturning).toHaveBeenCalled();

    expect(result).toEqual(mockResult);
  });

  it("ID-02: Should return empty array when inserting empty list", async () => {
    const input: any[] = [];

    mockReturning.mockResolvedValue([]);

    const result = await createManyTransactions(input);

    expect(result).toEqual([]);
  });

  it("ID-03: Should throw error when database fails", async () => {
    const input = [{ orderId: "ORD-001" }];

    mockReturning.mockRejectedValue(new Error("Database error"));

    await expect(createManyTransactions(input))
      .rejects
      .toThrow("Database error");
  });
});

// #region UTC-04-08
describe("UTC-04-08: createManyTransactionItems()", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockInsert.mockReturnValue({
      values: mockValues,
    });

    mockValues.mockReturnValue({
      returning: mockReturning,
    });
  });

  it("ID-01: Should insert transaction items and return inserted rows", async () => {
    const input = [
      { transactionId: 1, productId: 10, quantity: 2 },
      { transactionId: 1, productId: 11, quantity: 1 },
    ];

    const mockResult = [
      { id: 100, transactionId: 1, productId: 10, quantity: 2 },
      { id: 101, transactionId: 1, productId: 11, quantity: 1 },
    ];

    mockReturning.mockResolvedValue(mockResult);

    const result = await createManyTransactionItems(input);

    expect(mockInsert).toHaveBeenCalled();
    expect(mockValues).toHaveBeenCalledWith(input);
    expect(mockReturning).toHaveBeenCalled();

    expect(result).toEqual(mockResult);
  });

  it("ID-02: Should return empty array when inserting empty list", async () => {
    const input: any[] = [];

    mockReturning.mockResolvedValue([]);

    const result = await createManyTransactionItems(input);

    expect(result).toEqual([]);
  });

  it("ID-03: Should throw error when database fails", async () => {
    const input = [{ transactionId: 1, productId: 10, quantity: 2 }];

    mockReturning.mockRejectedValue(new Error("Database error"));

    await expect(createManyTransactionItems(input))
      .rejects
      .toThrow("Database error");
  });
});