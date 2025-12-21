import db from "@/db/connect";
import * as schema from "@/db/schema";
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