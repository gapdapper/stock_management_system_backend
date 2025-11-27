import db from "@/db/connect";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

export const getAllProductSizes = async () => {
    const productSizes = await db.query.productSize.findMany();
    return productSizes;
}

export const getProductSizeById = async (productSizeId: number) => {
    const productSize = await db.query.productSize.findFirst({
        where: eq(schema.productSize.id, productSizeId),
    });
    return productSize;
}

export const editProductSize = async (productSize: any) => {
    const result = await db.update(schema.productSize).set({
        size: productSize.size,
        updatedAt: new Date(),
    }).where(eq(schema.productSize.id, productSize.id)).returning();
    return result;
}

export const addProductSize = async (productSize: any) => {
    const result = await db.insert(schema.productSize).values(productSize).returning();
    return result[0];
}

export const deleteProductSize = async (productSizeId: number) => {
    const result = await db.delete(schema.productSize).where(eq(schema.productSize.id, productSizeId)).returning({
        deletedId: schema.productSize.id,
    });
    return result;
}