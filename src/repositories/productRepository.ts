import db from "@/db/connect";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

export const getAllProducts = async () => {
    const products = await db.query.product.findMany();
    return products;
}

export const getProductById = async (productId: number) => {
    const product = await db.query.product.findFirst({
        where: eq(schema.product.id, productId),
    });
    return product;
}

export const editProduct = async (product: any) => {
    const result = await db.update(schema.product).set({
        productName: product.productName,
        productSizeId: product.productSizeId,
        productColorId: product.productColorId,
        productQty: product.productQty,
        updatedAt: new Date(),
    }).where(eq(schema.product.id, product.id)).returning();
    return result;
}

export const addProduct = async (product: any) => {
    const result = await db.insert(schema.product).values(product).returning();
    return result[0];
}

export const deleteProduct = async (productId: number) => {
    const result = await db.delete(schema.product).where(eq(schema.product.id, productId)).returning({
        deletedId: schema.product.id,
    });
    return result;
}