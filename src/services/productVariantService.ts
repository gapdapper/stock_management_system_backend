import type { IProductVariant } from "@/models/product";
import * as productVariantRepository from "@/repositories/productVariantRepository"
import NotFoundError from "@/utils/errors/not-found";

export const editProductVariant = async (product: IProductVariant) => {
  const updatedProduct = await productVariantRepository.editProductVariant(product);
  if (!updatedProduct) {
    throw new NotFoundError({
      code: 404,
      message: `Product with ID ${product.id} not found`,
      logging: false,
    });
  }
  return updatedProduct;
}

export const restockProductVariant = async (productVariants: any) => {
  const updatedProduct = await productVariantRepository.updateMultipleVariantQuantity(productVariants);
  return updatedProduct;
}