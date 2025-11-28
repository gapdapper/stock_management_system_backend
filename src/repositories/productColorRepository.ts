import db from "@/db/connect";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

export const getAllProductColors = async () => {
    const productColors = await db.query.productColor.findMany();
    return productColors;
}

export const getProductColorById = async (productColorId: number) => {
    const productColor = await db.query.productColor.findFirst({
        where: eq(schema.productColor.id, productColorId),
    });
    return productColor;
}

export const editProductColor = async (productColor: any) => {
    const result = await db.update(schema.productColor).set({
        color: productColor.color,
        updatedAt: new Date(),
    }).where(eq(schema.productColor.id, productColor.id)).returning();
    return result;
}

export const addProductColor = async (productColor: any) => {
    const result = await db.insert(schema.productColor).values(productColor).returning();
    return result[0];
}

export const deleteProductColor = async (productColorId: number) => {
    const result = await db.delete(schema.productColor).where(eq(schema.productColor.id, productColorId)).returning({
        deletedId: schema.productColor.id,
    });
    return result;
}