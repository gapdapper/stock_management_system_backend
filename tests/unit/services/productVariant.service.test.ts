jest.mock("@/repositories/productVariantRepository", () => ({
  updateById: jest.fn(),
  updateQuantitiesByIds: jest.fn(),
}));

jest.mock("@/db/supabase", () => ({
  supabase: {},
}));

import { editProductVariant, restockProductVariant } from "@/services/productVariantService";
import * as productVariantRepository from "@/repositories/productVariantRepository";
import BadRequestError from "@/utils/errors/bad-request";
import NotFoundError from "@/utils/errors/not-found";

// #region UTC-01-06
describe("UTC-01-06: editProductVariant", () => {
  const validProduct = {
    id: 10,
    productId: 1,
    colorId: 2,
    sizeId: 3,
    qty: 25,
    minStock: 5,
    imageUrl: "wooden.png",
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Case 1: No product provided
  it("should throw NotFoundError if product is undefined", async () => {
    await expect(editProductVariant(undefined as any))
      .rejects
      .toBeInstanceOf(NotFoundError);

    expect(productVariantRepository.updateById).not.toHaveBeenCalled();
  });

  // Case 2: Negative qty
  it("should throw BadRequestError if qty is negative", async () => {
    const invalidProduct = { ...validProduct, qty: -1 };

    await expect(editProductVariant(invalidProduct))
      .rejects
      .toBeInstanceOf(BadRequestError);

    expect(productVariantRepository.updateById).not.toHaveBeenCalled();
  });

  // Case 3: Negative minStock
  it("should throw BadRequestError if minStock is negative", async () => {
    const invalidProduct = { ...validProduct, minStock: -5 };

    await expect(editProductVariant(invalidProduct))
      .rejects
      .toBeInstanceOf(BadRequestError);

    expect(productVariantRepository.updateById).not.toHaveBeenCalled();
  });

  // Case 4: Product not found in DB
  it("should throw NotFoundError if repository returns empty array", async () => {
    (productVariantRepository.updateById as jest.Mock)
      .mockResolvedValue([]);

    await expect(editProductVariant(validProduct))
      .rejects
      .toBeInstanceOf(NotFoundError);

    expect(productVariantRepository.updateById)
      .toHaveBeenCalledWith(10, expect.any(Object));
  });

  // Case 5: Success
  it("should return success message when update succeeds", async () => {
    (productVariantRepository.updateById as jest.Mock)
      .mockResolvedValue([validProduct]);

    const result = await editProductVariant(validProduct);

    expect(productVariantRepository.updateById)
      .toHaveBeenCalledWith(
        10,
        expect.objectContaining({
          productId: 1,
          qty: 25,
        })
      );

    expect(result).toEqual({ message: "success" });
  });
});


// #region UTC-01-08
describe("UTC-01-08: restockProductVariant", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Case 1: Not array
  it("should throw error when payload is not array", async () => {
    await expect(restockProductVariant(null as any))
      .rejects
      .toBeInstanceOf(BadRequestError);

    expect(productVariantRepository.updateQuantitiesByIds)
      .not.toHaveBeenCalled();
  });

  // Case 2: Empty array
  it("should throw error when array is empty", async () => {
    await expect(restockProductVariant([]))
      .rejects
      .toBeInstanceOf(BadRequestError);
  });

  // Case 3: Missing variantId
  it("should throw error when variantId is missing", async () => {
    const payload = [{ qty: 5 }];

    await expect(restockProductVariant(payload))
      .rejects
      .toBeInstanceOf(BadRequestError);
  });

  // Case 4: qty null
  it("should throw error when qty is null", async () => {
    const payload = [{ variantId: 1, qty: null }];

    await expect(restockProductVariant(payload))
      .rejects
      .toBeInstanceOf(BadRequestError);
  });

  // Case 5: qty <= 0
  it("should throw error when qty <= 0", async () => {
    const payload = [{ variantId: 1, qty: 0 }];

    await expect(restockProductVariant(payload))
      .rejects
      .toBeInstanceOf(BadRequestError);
  });

  // Case 6: Success
  it("should call repository and return success for valid payload", async () => {
    const payload = [{ variantId: 1, qty: 5 }];

    const result = await restockProductVariant(payload);

    expect(productVariantRepository.updateQuantitiesByIds)
      .toHaveBeenCalledWith(payload);

    expect(result).toEqual({ message: "success" });
  });
});
