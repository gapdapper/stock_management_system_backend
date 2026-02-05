import db from "@/db/connect";
import * as schema from "@/db/schema";
import type { IProductVariant, IProductVariantPayload } from "@/models/product";
import { and, eq, sql } from "drizzle-orm";

export const getAllProductVariants = async () => {
    const productVariants = await db.query.productVariant.findMany();
    return productVariants;
}

export const getProductVariantById = async (productVariantId: number) => {
    const productVariant = await db.query.productVariant.findFirst({
        where: eq(schema.productVariant.id, productVariantId),
    });
    return productVariant;
}

export const getProductVariantByProductIdColorIdSizeId = async (productId: number, colorId: number, sizeId: number) => {
    const productVariant = await db.query.productVariant.findFirst({
        where: and(
            eq(schema.productVariant.productId, productId),
            eq(schema.productVariant.colorId, colorId),
            eq(schema.productVariant.sizeId, sizeId),
        )
    });
    return productVariant;
}

export const updateProductVariantQuantity = async (productVariantId: number, quantityChange: number) => {
    // accept both positive and negative quantityChange
    const result = await db.update(schema.productVariant).set({
        qty: sql`${schema.productVariant.qty} + ${quantityChange}`,
        updatedAt: new Date(),
    }).where(eq(schema.productVariant.id, productVariantId)).returning();
    return result;
}

export const editProductVariant = async (productVariant: IProductVariant) => {
    const result = await db.update(schema.productVariant).set({
        qty: productVariant.qty,
        minStock: productVariant.minStock,
        updatedAt: new Date(),
    }).where(eq(schema.productVariant.id, productVariant.id)).returning();
    return result;
}

export const updateMultipleVariantQuantity = async (
  items: IProductVariantPayload[]
) => {
  if (!items || items.length === 0) return "NO_VARIANT_PROVIDED";
  await db.transaction(async (tx) => {
    for (const item of items) {
      await tx
        .update(schema.productVariant)
        .set({
          qty: sql`${schema.productVariant.qty} + ${item.qty}`,
          updatedAt: new Date(),
        })
        .where(eq(schema.productVariant.id, item.variantId));
    }
  });
  return "BULK_RESTOCK_SUCCESS"
};

export const addProductVariantImageUrl = async (
  productId: number,
  imageUrl: string
) => {
  await db
    .update(schema.productVariant)
    .set({ imageUrl: imageUrl })
    .where(eq(schema.product.id, productId));
};
