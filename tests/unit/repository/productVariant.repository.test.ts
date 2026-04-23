const mockFindFirst = jest.fn();
const mockTransaction = jest.fn();
const mockUpdate = jest.fn();
const mockSet = jest.fn();
const mockWhere = jest.fn();
const mockReturning = jest.fn();
const mockSelect = jest.fn();

// ----- drizzle chain -----
mockUpdate.mockReturnValue({
  set: mockSet,
});

mockSet.mockReturnValue({
  where: mockWhere,
});

mockWhere.mockReturnValue({
  returning: mockReturning,
});

// ----- db mock -----
jest.mock("@/db/connect", () => ({
  __esModule: true,
  default: {
    query: {
      productVariant: {
        findFirst: mockFindFirst,
      },
    },
    update: mockUpdate,
    transaction: mockTransaction,
    select: mockSelect,
  },
}));

// ----- drizzle mock -----
jest.mock("drizzle-orm", () => ({
  eq: jest.fn(() => "mocked-eq"),
  sql: jest.fn(() => "mocked-sql"),
  lt: jest.fn(() => "mocked-lt"),
}));

// ----- schema mock -----
jest.mock("@/db/schema", () => ({
  productVariant: {
    id: "id",
    qty: "qty",
    minStock: "minStock",
    productId: "productId",
    colorId: "colorId",
    sizeId: "sizeId",
  },
  product: {
    id: "productId",
    productName: "productName",
  },
  productColor: {
    id: "colorId",
    color: "color",
  },
  productSize: {
    id: "sizeId",
    size: "size",
  },
}));
import * as schema from "@/db/schema";
import type { IProductVariant } from "@/models/product";
import {
  findById,
  updateQuantitiesByIds,
  updateById,
  updateQuantityById,
  findLowStockProductVariant,
} from "@/repositories/productVariantRepository";
import db from "@/db/connect";

const createMockVariant = (
  override?: Partial<IProductVariant>,
): IProductVariant => ({
  id: 1,
  productId: 10,
  colorId: null,
  sizeId: null,
  qty: 100,
  minStock: 5,
  imageUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...override,
});

describe("productVariantRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // setup chain mock for drizzle
    mockUpdate.mockReturnValue({
      set: mockSet,
    });

    mockSet.mockReturnValue({
      where: mockWhere,
    });
  });

  // #region UTC-01-11
  describe("UTC-01-11: findById()", () => {
    const mockProductVariant = {
      id: 1,
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-01-02"),
      imageUrl: "image.jpg",
      productId: 10,
      colorId: 2,
      sizeId: 3,
      qty: 100,
      minStock: 10,
    };

    it("should return product variant when id exists", async () => {
      mockFindFirst.mockResolvedValue(mockProductVariant);

      const result = await findById(1);

      expect(mockFindFirst).toHaveBeenCalled();
      expect(result).toEqual(mockProductVariant);
    });

    it("should return undefined when id does not exist", async () => {
      mockFindFirst.mockResolvedValue(undefined);

      const result = await findById(999);

      expect(result).toBeUndefined();
    });

    it("should throw error when database query fails", async () => {
      mockFindFirst.mockRejectedValue(new Error("Database error"));

      await expect(findById(1)).rejects.toThrow("Database error");
    });
  });

  // #region UTC-01-12
  describe("UTC-01-12: updateQuantitiesByIds()", () => {
    it("should return NO_VARIANT_PROVIDED when items is undefined", async () => {
      const result = await updateQuantitiesByIds(undefined as any);
      expect(result).toBe("NO_VARIANT_PROVIDED");
    });

    it("should return NO_VARIANT_PROVIDED when items is empty", async () => {
      const result = await updateQuantitiesByIds([]);
      expect(result).toBe("NO_VARIANT_PROVIDED");
    });

    it("should update quantities and return BULK_RESTOCK_SUCCESS", async () => {
      mockTransaction.mockImplementation(async (callback: any) => {
        await callback({
          update: mockUpdate,
        });
      });

      const items = [
        { variantId: 1, qty: 10 },
        { variantId: 2, qty: 5 },
      ];

      const result = await updateQuantitiesByIds(items);

      expect(mockTransaction).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledTimes(2);
      expect(mockWhere).toHaveBeenCalledTimes(2);
      expect(result).toBe("BULK_RESTOCK_SUCCESS");
    });

    it("should throw error when transaction fails", async () => {
      mockTransaction.mockRejectedValue(new Error("Transaction failed"));

      const items = [{ variantId: 1, qty: 10 }];

      await expect(updateQuantitiesByIds(items)).rejects.toThrow(
        "Transaction failed",
      );
    });
  });
});

// #region UTC-01-10
describe("UTC-01-10: updateById()", () => {
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

  it("UTC-01-01: Should update product variant and return updated row", async () => {
    const mockResult = [
      {
        id: 1,
        productId: 10,
        colorId: 2,
        sizeId: 3,
        qty: 50,
        minStock: 5,
        imageUrl: "test.jpg",
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    ];

    mockReturning.mockResolvedValue(mockResult);

    const result = await updateById(1, { qty: 50 });

    expect(mockUpdate).toHaveBeenCalledTimes(1);

    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        qty: 50,
        updatedAt: expect.any(Date),
      }),
    );

    expect(mockWhere).toHaveBeenCalledTimes(1);
    expect(mockReturning).toHaveBeenCalledTimes(1);

    expect(result).toEqual(mockResult);
  });

  it("UTC-01-02: Should return empty array if no row updated", async () => {
    mockReturning.mockResolvedValue([]);

    const result = await updateById(999, { qty: 10 });

    expect(result).toEqual([]);
  });

  it("UTC-01-03: Should throw error if database fails", async () => {
    mockReturning.mockRejectedValue(new Error("DB Error"));

    await expect(updateById(1, { qty: 10 })).rejects.toThrow("DB Error");
  });
});

// #region UTC-04-09
describe("UTC-04-09: updateQuantityById()", () => {
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

  it("ID-01: Should increase quantity and return updated row", async () => {
    const id = 1;
    const quantityChange = 5;

    const mockResult = [{ id: 1, qty: 15 }];

    mockReturning.mockResolvedValue(mockResult);

    const result = await updateQuantityById(id, quantityChange);

    expect(mockUpdate).toHaveBeenCalled();
    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        updatedAt: expect.any(Date),
      }),
    );
    expect(mockWhere).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });

  it("ID-02: Should decrease quantity and return updated row", async () => {
    const id = 1;
    const quantityChange = -3;

    const mockResult = [{ id: 1, qty: 7 }];

    mockReturning.mockResolvedValue(mockResult);

    const result = await updateQuantityById(id, quantityChange);

    expect(result).toEqual(mockResult);
  });

  it("ID-03: Should return empty array if no variant found", async () => {
    mockReturning.mockResolvedValue([]);

    const result = await updateQuantityById(999, 5);

    expect(result).toEqual([]);
  });

  it("ID-04: Should throw error when database fails", async () => {
    mockReturning.mockRejectedValue(new Error("Database error"));

    await expect(updateQuantityById(1, 5)).rejects.toThrow("Database error");
  });
});

// #region UTC-01-16
describe("UTC-01-16: findLowStockProductVariant()", () => {
  let mockWhere: jest.Mock;

  const mockResult = [
    {
      variantId: 1,
      qty: 2,
      minStock: 10,
      productName: "Test Product",
      colorName: "Red",
      sizeName: "M",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockWhere = jest.fn().mockResolvedValue(mockResult);
    let mockLeftJoin: jest.Mock;

    mockLeftJoin = jest.fn();

    mockLeftJoin.mockReturnValue({
      leftJoin: mockLeftJoin,
      where: mockWhere,
    });

    const mockFrom = jest.fn().mockReturnValue({
      leftJoin: mockLeftJoin,
    });

    (db.select as jest.Mock).mockReturnValue({
      from: mockFrom,
    });
  });

  test("ID-01: Should return low stock product variants", async () => {
    const result = await findLowStockProductVariant();

    expect(result).toEqual(mockResult);
  });

  test("ID-02: Should return empty array when no data found", async () => {
    mockWhere.mockResolvedValue([]);

    const result = await findLowStockProductVariant();

    expect(result).toEqual([]);
  });

  test("ID-03: Should throw error when db fails", async () => {
    mockWhere.mockRejectedValue(new Error("DB error"));

    await expect(findLowStockProductVariant()).rejects.toThrow("DB error");
  });
});
