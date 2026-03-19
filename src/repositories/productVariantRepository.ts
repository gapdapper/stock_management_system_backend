import db from "@/db/connect";
import * as schema from "@/db/schema";
import type { IProductVariant, IProductVariantPayload } from "@/models/product";
import { and, eq, lte, sql } from "drizzle-orm";

export const findAll = async () => {
  const productVariants = await db.query.productVariant.findMany();
  return productVariants;
};

export const findById = async (id: number) => {
  const productVariant = await db.query.productVariant.findFirst({
    where: eq(schema.productVariant.id, id),
  });
  return productVariant;
};

export const findByProductIdAndAttributesId = async (
  productId: number,
  colorId: number,
  sizeId: number,
) => {
  const productVariant = await db.query.productVariant.findFirst({
    where: and(
      eq(schema.productVariant.productId, productId),
      eq(schema.productVariant.colorId, colorId),
      eq(schema.productVariant.sizeId, sizeId),
    ),
  });
  return productVariant;
};

export const updateQuantityById = async (
  id: number,
  quantityChange: number,
) => {
  // accept both positive and negative quantityChange
  const result = await db
    .update(schema.productVariant)
    .set({
      qty: sql`${schema.productVariant.qty} + ${quantityChange}`,
      updatedAt: new Date(),
    })
    .where(eq(schema.productVariant.id, id))
    .returning();
  return result;
};

export const updateById = async (
  id: number,
  data: Partial<IProductVariant>,
) => {
  const result = await db
    .update(schema.productVariant)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(schema.productVariant.id, id))
    .returning();
  return result;
};

export const updateQuantitiesByIds = async (
  items: IProductVariantPayload[],
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
  return "BULK_RESTOCK_SUCCESS";
};

export const findLowStockProductVariant = async () => {
  return await db
    .select({
      variantId: schema.productVariant.id,
      qty: schema.productVariant.qty,
      minStock: schema.productVariant.minStock,
      productName: schema.product.productName,
      colorName: schema.productColor.color,
      sizeName: schema.productSize.size,
    })
    .from(schema.productVariant)
    .leftJoin(schema.product, eq(schema.productVariant.productId, schema.product.id))
    .leftJoin(schema.productColor, eq(schema.productVariant.colorId, schema.productColor.id))
    .leftJoin(schema.productSize, eq(schema.productVariant.sizeId, schema.productSize.id))
    .where(lte(schema.productVariant.qty, schema.productVariant.minStock));
};
