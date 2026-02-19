import db from "@/db/connect";
import * as schema from "@/db/schema";
import type { IProduct } from "@/models/product";
import { eq } from "drizzle-orm";

export const findAll = async () => {
  const products = await db.query.product.findMany();
  return products;
};

export const findAllWithVariant = async () => {
  const rows = await db
    .select({
      productId: schema.product.id,
      productName: schema.product.productName,
      productImageUrl: schema.product.imageUrl,

      variantId: schema.productVariant.id,
      qty: schema.productVariant.qty,
      minStock: schema.productVariant.minStock,
      variantUpdatedAt: schema.productVariant.updatedAt,
      variantImageUrl: schema.productVariant.imageUrl,

      size: schema.productSize.size,
      color: schema.productColor.color,
    })
    .from(schema.product)
    .leftJoin(
      schema.productVariant,
      eq(schema.product.id, schema.productVariant.productId)
    )
    .leftJoin(
      schema.productSize,
      eq(schema.productVariant.sizeId, schema.productSize.id)
    )
    .leftJoin(
      schema.productColor,
      eq(schema.productVariant.colorId, schema.productColor.id)
    );

  return rows;
};

export const findById = async (productId: number) => {
  const product = await db.query.product.findFirst({
    where: eq(schema.product.id, productId),
  });
  return product;
};

export const updateById = async (id:number, data: Partial<IProduct>) => {
  const result = await db
    .update(schema.product)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(schema.product.id, id))
    .returning();
  return result;
};

export const create = async (product: any) => {
  const result = await db.insert(schema.product).values(product).returning();
  return result[0];
};

export const deleteById = async (productId: number) => {
  const result = await db
    .delete(schema.product)
    .where(eq(schema.product.id, productId))
    .returning({
      deletedId: schema.product.id,
    });
  return result;
};
