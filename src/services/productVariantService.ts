import type { IProductVariant } from "@/models/product";
import * as productVariantRepository from "@/repositories/productVariantRepository"
import NotFoundError from "@/utils/errors/not-found";
import { supabase } from "@/db/supabase";
import sharp from "sharp";

export const editProductVariant = async (product: IProductVariant) => {
  const updatedProduct: IProductVariant[] = await productVariantRepository.updateById(product.id, product);
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
  const updatedProduct = await productVariantRepository.updateQuantitiesByIds(productVariants);
  return updatedProduct;
}

export const uploadProductImage = async (
  variantId: number,
  file: Express.Multer.File,
) => {
  if (!file) {
    throw new Error("No file provided");
  }

  if (!file.mimetype.startsWith("image/")) {
    throw new Error("Invalid file type");
  }

  const product = await productVariantRepository.findById(variantId);
  if (!product) {
    throw new Error("Product not found");
  }

  try {
    const webpBuffer = await sharp(file.buffer)
      .resize({
        width: 1024,
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();

    const filePath = `product-variants/${variantId}/cover-${Date.now()}.webp`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, webpBuffer, {
        contentType: "image/webp",
      });

    if (error) {
      throw new Error("Failed to upload image");
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    const publicUrlObj = { imageUrl: data.publicUrl };
    await productVariantRepository.updateById(variantId, publicUrlObj);

    // remove previous image
    if (product.imageUrl) {
      const oldPath = product.imageUrl.split(
        "/storage/v1/object/public/product-images/",
      )[1];
      if (oldPath) {
        await supabase.storage.from("product-images").remove([oldPath]);
      }
    }

    return data.publicUrl;
  } catch (err) {
    console.error("uploadProductImage failed:", err);
    throw new Error("Failed to upload product image");
  }
};