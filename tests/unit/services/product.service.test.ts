jest.mock("@/db/supabase", () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
        remove: jest.fn(),
      })),
    },
  },
}));

jest.mock("sharp", () => {
  return jest.fn(() => ({
    resize: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockResolvedValue(Buffer.from("mock")),
  }));
});

// ===============================
// MOCK REPOSITORY
// ===============================
jest.mock("@/repositories/productRepository");

import { getAllProductsWithVariant } from "@/services/productService";
import * as productRepository from "@/repositories/productRepository";
import NotFoundError from "@/utils/errors/not-found";
import type { IProductRow } from "@/models/product";

describe("UTC-01-07: getAllProductsWithVariant()", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  /* =========================================================
     TC-01
     Should group variants, calculate stock,
     sort size & color correctly
  ========================================================= */
  it("should return shaped products correctly", async () => {
    const mockRows: IProductRow[] = [
      {
        productId: 1,
        productName: "Test Product 1",
        size: "Size M",
        color: "Red",
        variantId: 11,
        qty: 10,
        minStock: 2,
        productImageUrl: null,
        variantUpdatedAt: new Date("2026-02-23T10:00:00Z"),
        variantImageUrl: null,
      },
      {
        productId: 1,
        productName: "Test Product 1",
        size: "Size M",
        color: "Blue",
        variantId: 12,
        qty: 5,
        minStock: 1,
        productImageUrl: null,
        variantUpdatedAt: new Date("2026-02-23T12:00:00Z"),
        variantImageUrl: null,
      },
      {
        productId: 1,
        productName: "Test Product 1",
        size: "Size S",
        color: "Black",
        variantId: 13,
        qty: 8,
        minStock: 1,
        productImageUrl: null,
        variantUpdatedAt: new Date("2026-02-23T09:00:00Z"),
        variantImageUrl: null,
      },
    ];

    (productRepository.findAllWithVariant as jest.Mock)
      .mockResolvedValue(mockRows);

    const result = await getAllProductsWithVariant();

    // ===== Basic structure =====
    expect(result).toHaveLength(1);

    const product = result[0];
    if(product) {
      expect(product.id).toBe(1);
      expect(product.productName).toBe("Test Product 1");
  
      // ===== Total stock =====
      expect(product.totalStock).toBe(23); // 10 + 5 + 8
  
      // ===== Latest updated =====
      expect(product.lastUpdated).toEqual(
        new Date("2026-02-23T12:00:00Z")
      );
  
      // ===== Size sorting (Size S < Size M) =====
      expect(product.variants.map(v => v.size))
        .toEqual(["Size S", "Size M"]);
  
      // ===== Color sorting (A-Z) =====
      const sizeM = product.variants.find(v => v.size === "Size M");
      expect(sizeM?.sub.map(s => s.color))
        .toEqual(["Blue", "Red"]);
    }
  });

  /* =========================================================
     TC-02
     Should throw NotFoundError when no data
  ========================================================= */
  it("should throw NotFoundError when no products found", async () => {
    (productRepository.findAllWithVariant as jest.Mock)
      .mockResolvedValue([]);

    await expect(getAllProductsWithVariant())
      .rejects
      .toBeInstanceOf(NotFoundError);
  });

  /* =========================================================
     TC-03
     Should throw error when repository fails
  ========================================================= */
  it("should throw error when repository throws", async () => {
    (productRepository.findAllWithVariant as jest.Mock)
      .mockRejectedValue(new Error("DB error"));

    await expect(getAllProductsWithVariant())
      .rejects
      .toThrow("DB error");
  });
});

