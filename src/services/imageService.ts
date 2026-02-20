import * as productVariantRepository from "@/repositories/productVariantRepository";
import * as productRepository from "@/repositories/productRepository";
import { supabase } from "@/db/supabase";
import sharp from "sharp";

export const uploadProductImage = async (
  entityType: "product" | "variant",
  entityId: number,
  file: Express.Multer.File,
) => {
  if (!file) {
    throw new Error("No file provided");
  }

  if (!file.mimetype.startsWith("image/")) {
    throw new Error("Invalid file type");
  }

  const existingRecord =
    entityType == "product"
      ? await productRepository.findById(entityId)
      : await productVariantRepository.findById(entityId);
  if (!existingRecord) {
    throw new Error("Product or Product Variant not found");
  }

  try {
    const webpBuffer = await sharp(file.buffer)
      .resize({
        width: 1024,
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();

    const pathPrefix = entityType == "product" ? "product" : "product-variant";
    const filePath = `${pathPrefix}/${entityId}/cover-${Date.now()}.webp`;
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

    if (entityType == "product") {
      // update img url to db
      const publicUrlObj = { imageUrl: data.publicUrl };
      await productRepository.updateById(entityId, publicUrlObj);
    } else {
      // update img url to db
      const publicUrlObj = { imageUrl: data.publicUrl };
      await productVariantRepository.updateById(entityId, publicUrlObj);
    }

    // remove previous image
    if (existingRecord.imageUrl) {
      const oldPath = existingRecord.imageUrl.split(
        `/storage/v1/object/public/${pathPrefix}/`,
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
