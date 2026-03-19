jest.mock("@/repositories/productRepository", () => ({
  findAllWithVariant: jest.fn(),
}));

jest.mock("@/db/supabase", () => ({
  supabase: {},
}));

import * as productRepository from "@/repositories/productRepository";
import { getAllProductsWithVariant } from "@/services/productService";
import NotFoundError from "@/utils/errors/not-found";

// #region UTC-01-08
describe("UTC-01-08: getAllProductsWithVariant()", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Positive Cases", () => {
    it("should group rows into wooden toy product with variants correctly", async () => {
      const mockRows = [
        {
          productId: 1,
          productName: "Wooden Building Blocks",
          size: "Size M",
          color: "Natural",
          variantId: 101,
          qty: 12,
          minStock: 3,
          productImageUrl: "blocks.jpg",
          variantUpdatedAt: new Date("2026-03-01"),
          variantImageUrl: "blocks-natural.jpg",
        },
        {
          productId: 1,
          productName: "Wooden Building Blocks",
          size: "Size M",
          color: "Rainbow",
          variantId: 102,
          qty: 8,
          minStock: 2,
          productImageUrl: "blocks.jpg",
          variantUpdatedAt: new Date("2026-03-03"),
          variantImageUrl: "blocks-rainbow.jpg",
        },
      ];

      (productRepository.findAllWithVariant as jest.Mock).mockResolvedValue(
        mockRows
      );

      const result = await getAllProductsWithVariant();

      expect(result).toHaveLength(1);
      expect(result[0]!.productName).toBe("Wooden Building Blocks");
      expect(result[0]!.totalStock).toBe(20); // 12 + 8
      expect(result[0]!.lastUpdated).toEqual(new Date("2026-03-03"));

      expect(result[0]!.variants).toHaveLength(1);
      expect(result[0]!.variants[0]!.size).toBe("Size M");
      expect(result[0]!.variants[0]!.sub).toHaveLength(2);

      // color should be sorted alphabetically
      expect(result[0]!.variants[0]!.sub[0]!.color).toBe("Natural");
      expect(result[0]!.variants[0]!.sub[1]!.color).toBe("Rainbow");
    });

    it("should sort wooden toy variants by size order", async () => {
      const mockRows = [
        {
          productId: 2,
          productName: "Wooden Puzzle Board",
          size: "Size L",
          color: "Animal Theme",
          variantId: 201,
          qty: 5,
          minStock: 1,
          productImageUrl: null,
          variantUpdatedAt: new Date(),
          variantImageUrl: null,
        },
        {
          productId: 2,
          productName: "Wooden Puzzle Board",
          size: "Size S",
          color: "Alphabet Theme",
          variantId: 202,
          qty: 7,
          minStock: 2,
          productImageUrl: null,
          variantUpdatedAt: new Date(),
          variantImageUrl: null,
        },
      ];

      (productRepository.findAllWithVariant as jest.Mock).mockResolvedValue(
        mockRows
      );

      const result = await getAllProductsWithVariant();

      expect(result[0]!.variants[0]!.size).toBe("Size S");
      expect(result[0]!.variants[1]!.size).toBe("Size L");
    });

    it("should ignore rows with null variant fields but still count stock", async () => {
      const mockRows = [
        {
          productId: 3,
          productName: "Wooden Train Set",
          size: null,
          color: null,
          variantId: null,
          qty: 15,
          minStock: 5,
          productImageUrl: null,
          variantUpdatedAt: null,
          variantImageUrl: null,
        },
      ];

      (productRepository.findAllWithVariant as jest.Mock).mockResolvedValue(
        mockRows
      );

      const result = await getAllProductsWithVariant();

      expect(result[0]!.productName).toBe("Wooden Train Set");
      expect(result[0]!.variants).toHaveLength(0);
      expect(result[0]!.totalStock).toBe(15);
    });
  });

  describe("Negative Cases", () => {
    it("should throw NotFoundError if no wooden toy products found", async () => {
      (productRepository.findAllWithVariant as jest.Mock).mockResolvedValue(
        []
      );

      await expect(getAllProductsWithVariant()).rejects.toThrow(
        NotFoundError
      );
    });
  });
});