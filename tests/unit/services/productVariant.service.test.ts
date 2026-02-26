// ===============================
// MOCK REPOSITORY
// ===============================
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

jest.mock("@/repositories/productVariantRepository");

import { editProductVariant } from "@/services/productVariantService";
import * as productVariantRepository from "@/repositories/productVariantRepository";
import NotFoundError from "@/utils/errors/not-found";
import BadRequestError from "@/utils/errors/bad-request";
import type { IProductVariant } from "@/models/product";

describe("UTC-01-05: editProductVariant()", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  /* =========================================================
     TC-01
     Should update product variant successfully
  ========================================================= */
  it("should update product variant successfully", async () => {
    const mockInput: IProductVariant = {
      id: 1,
      qty: 30,
      minStock: 10,
      sizeId: 1,
      colorId: 1,
      productId: 1,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (productVariantRepository.updateById as jest.Mock)
      .mockResolvedValue([mockInput]);

    const result = await editProductVariant(mockInput);

    expect(productVariantRepository.updateById).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        qty: 30,
        minStock: 10,
      })
    );

    expect(result).toEqual({ message: "success" });
  });

  /* =========================================================
     TC-02
     Should throw NotFoundError when variant not found
  ========================================================= */
  it("should throw NotFoundError when product variant does not exist", async () => {
    const mockInput: IProductVariant = {
      id: 999,
      qty: 20,
      minStock: 5,
      sizeId: 1,
      colorId: 1,
      productId: 1,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (productVariantRepository.updateById as jest.Mock)
      .mockResolvedValue([]);

    await expect(editProductVariant(mockInput))
      .rejects
      .toBeInstanceOf(NotFoundError);

    await expect(editProductVariant(mockInput))
      .rejects
      .toThrow("Product with ID 999 not found");
  });

  /* =========================================================
     TC-03
     Should throw NotFoundError when no product provided
  ========================================================= */
  it("should throw NotFoundError when no product provided", async () => {
    await expect(editProductVariant(undefined as any))
      .rejects
      .toBeInstanceOf(NotFoundError);

    await expect(editProductVariant(undefined as any))
      .rejects
      .toThrow("No product provided");
  });

  /* =========================================================
     TC-04
     Should throw BadRequestError when qty or minStock < 0
  ========================================================= */
  it("should throw BadRequestError when qty is negative", async () => {
    const mockInput: IProductVariant = {
      id: 1,
      qty: -1,
      minStock: 5,
      sizeId: 1,
      colorId: 1,
      productId: 1,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await expect(editProductVariant(mockInput))
      .rejects
      .toBeInstanceOf(BadRequestError);

    await expect(editProductVariant(mockInput))
      .rejects
      .toThrow("Incorrect value");
  });

  /* =========================================================
     TC-05
     Should throw error when repository throws (DB failure)
  ========================================================= */
  it("should propagate error when database fails", async () => {
    const mockInput: IProductVariant = {
      id: 1,
      qty: 30,
      minStock: 10,
      sizeId: 1,
      colorId: 1,
      productId: 1,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (productVariantRepository.updateById as jest.Mock)
      .mockRejectedValue(new Error("DB error"));

    await expect(editProductVariant(mockInput))
      .rejects
      .toThrow("DB error");
  });
});