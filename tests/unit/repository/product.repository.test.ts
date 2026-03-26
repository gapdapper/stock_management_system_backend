const mockSelect = jest.fn();
const mockFrom = jest.fn();
const mockLeftJoin = jest.fn();
const mockUpdate = jest.fn();
const mockSet = jest.fn();
const mockWhere = jest.fn();
const mockReturning = jest.fn();

jest.mock("@/db/connect", () => ({
  __esModule: true,
  default: {
    select: mockSelect,
    update: mockUpdate,
  },
}));

jest.mock("@/db/schema", () => ({
  product: {
    id: "product-id",
    productName: "productName",
    imageUrl: "imageUrl",
  },
  productVariant: {
    id: "variant-id",
    qty: "qty",
    minStock: "minStock",
    updatedAt: "updatedAt",
    imageUrl: "variantImageUrl",
  },
  size: {
    size: "size",
  },
  color: {
    color: "color",
  },
}));

jest.mock("drizzle-orm", () => ({
  eq: jest.fn(() => "mocked-eq"),
}));

jest.mock("@/db/schema", () => ({
  product: {
    id: "product.id",
    productName: "product.productName",
    productSizeId: "product.productSizeId",
    productColorId: "product.productColorId",
    productQty: "product.productQty",
    imageUrl: "product.imageUrl",
    updatedAt: "product.updatedAt",
    createdAt: "product.createdAt",
  },
  productVariant: {
    id: "productVariant.id",
    qty: "productVariant.qty",
    minStock: "productVariant.minStock",
    updatedAt: "productVariant.updatedAt",
  },
  productSize: {
    id: "productSize.id",
    sizeName: "productSize.sizeName",
  },
  productColor: {
    id: "productColor.id",
    colorName: "productColor.colorName",
  },
}));

import type { IProduct } from "@/models/product";
import { findAllWithVariant, updateById } from "@/repositories/productRepository";
import * as schema from "@/db/schema";

// #region UTC-01-14
describe("UTC-01-14: findAllWithVariant()", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockSelect.mockReturnValue({
      from: mockFrom,
    });

    mockFrom.mockReturnValue({
      leftJoin: mockLeftJoin,
    });

    mockLeftJoin
      .mockReturnValueOnce({ leftJoin: mockLeftJoin })
      .mockReturnValueOnce({ leftJoin: mockLeftJoin });
  });

  it("should return wooden toy product rows when query succeeds", async () => {
    const mockRows = [
      {
        productId: 1,
        productName: "Wooden Train",
        productImageUrl: "wooden-train.jpg",
        variantId: 101,
        qty: 50,
        minStock: 10,
        variantUpdatedAt: new Date("2025-02-01"),
        variantImageUrl: "wooden-train-red.jpg",
        size: "Small",
        color: "Red",
      },
      {
        productId: 2,
        productName: "Wooden Puzzle",
        productImageUrl: "wooden-puzzle.jpg",
        variantId: 201,
        qty: 30,
        minStock: 5,
        variantUpdatedAt: new Date("2025-02-02"),
        variantImageUrl: "wooden-puzzle-blue.jpg",
        size: "Medium",
        color: "Blue",
      },
    ];

    mockLeftJoin.mockResolvedValueOnce(mockRows);

    const result = await findAllWithVariant();

    expect(mockSelect).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockRows);
  });

  it("should return empty array when no wooden toy data found", async () => {
    mockLeftJoin.mockResolvedValueOnce([]);

    const result = await findAllWithVariant();

    expect(result).toEqual([]);
  });

  it("should throw error when database fails", async () => {
    mockSelect.mockImplementation(() => {
      throw new Error("Database error");
    });

    await expect(findAllWithVariant()).rejects.toThrow(
      "Database error"
    );
  });
});

// #region UTC-01-15
describe("UTC-01-15: updateById()", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // re-setup drizzle chain
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

  it("UTC-PRD-UPDATE-01-01: Should update product and return updated row", async () => {
    const mockResult: IProduct[] = [
      {
        id: 1,
        productName: "New Name",
        productSizeId: 1,
        productColorId: 2,
        productQty: 20,
        imageUrl: "image.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockReturning.mockResolvedValue(mockResult);

    const result = await updateById(1, {
      productName: "New Name",
      productQty: 20,
    });

    expect(mockUpdate).toHaveBeenCalledWith(schema.product);

    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        productName: "New Name",
        productQty: 20,
        updatedAt: expect.any(Date),
      })
    );

    expect(mockWhere).toHaveBeenCalledTimes(1);
    expect(mockReturning).toHaveBeenCalledTimes(1);

    expect(result).toEqual(mockResult);
  });

  it("UTC-PRD-UPDATE-01-02: Should return empty array if no row updated", async () => {
    mockReturning.mockResolvedValue([]);

    const result = await updateById(999, {
      productQty: 10,
    });

    expect(result).toEqual([]);
  });

  it("UTC-PRD-UPDATE-01-03: Should throw error when database fails", async () => {
    mockReturning.mockRejectedValue(new Error("DB Error"));

    await expect(
      updateById(1, { productQty: 10 })
    ).rejects.toThrow("DB Error");
  });
});