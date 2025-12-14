import db from "@/db/connect";
import * as schema from "@/db/schema";
import { and, eq } from "drizzle-orm";

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