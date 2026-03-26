import type { ILowstockProduct, IProductVariant } from "@/models/product";
import * as productVariantRepository from "@/repositories/productVariantRepository";
import NotFoundError from "@/utils/errors/not-found";
import { supabase } from "@/db/supabase";
import sharp from "sharp";
import BadRequestError from "@/utils/errors/bad-request";
import axios from "axios";

const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.WEBHOOK_TOKEN}`,
};

const URL = "https://api.line.me/v2/bot/message/push";

export const editProductVariant = async (product: IProductVariant) => {
  if (!product) {
    throw new NotFoundError({
      code: 404,
      message: "No product provided",
      logging: false,
    });
  }
  const { id, createdAt, ...updateData } = product;
  if (product.qty < 0 || product.minStock < 0) {
    throw new BadRequestError({
      code: 400,
      message: `Incorrect value`,
      logging: false,
    });
  }
  const updatedProduct: IProductVariant[] =
    await productVariantRepository.updateById(product.id, updateData);
  if (!updatedProduct.length) {
    throw new NotFoundError({
      code: 404,
      message: `Product with ID ${product.id} not found`,
      logging: false,
    });
  }
  return { message: "success" };
};

export const restockProductVariant = async (productVariants: any) => {
  if (!Array.isArray(productVariants) || productVariants.length === 0) {
    throw new BadRequestError({
      code: 400,
      message: "Product variant ID is required",
      logging: false,
    });
  }

  for (const variant of productVariants) {
    if (!variant.variantId) {
      throw new BadRequestError({
        code: 400,
        message: "Product variant ID is required",
        logging: false,
      });
    }

    if (variant.qty == null || variant.qty <= 0) {
      throw new BadRequestError({
        code: 400,
        message: "Quantity must be greater than 0",
        logging: false,
      });
    }
  }
  await productVariantRepository.updateQuantitiesByIds(productVariants);
  return { message: "success" };
};

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

export const checkLowStockProduct = async () => {
  try {
    const lowStockProduct: ILowstockProduct[] =
      await productVariantRepository.findLowStockProductVariant();
    if (lowStockProduct.length === 0) return;

    const message = [
      "🔴 สินค้าใกล้หมดสต็อก\n",
      ...lowStockProduct.map((item) => {
        const color = item.colorName ?? "-";
        const size = item.sizeName ?? "-";

        return `- ${item.productName} (${color} / ${size})
  เหลือ: ${item.qty} | ขั้นต่ำ: ${item.minStock}`;
      }),
    ].join("\n");

    await axios.post(
      URL,
      {
        to: "Cd06404215eac49328d5c1d4029193a7c",
        messages: [
          {
            type: "text",
            text: message,
          },
        ],
      },
      { headers: HEADERS },
    );
  } catch (err) {
    console.error("failed to check low stock product:", err);
    throw new Error("Failed to check low stock product");
  }
};
