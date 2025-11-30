import db from "@/db/connect";
import * as schema from "@/db/schema";
import { and, eq } from "drizzle-orm";

// #region Transaction
export const getAllTransactions = async () => {
    const transactions = await db.query.transaction.findMany();
    return transactions;
}

export const getTransactionById = async (transactionId: number) => {
    const transaction = await db.query.transaction.findFirst({
        where: eq(schema.transaction.id, transactionId),
    });
    return transaction;
}

export const editTransaction = async (transaction: any) => {
    const result = await db.update(schema.transaction).set({
        orderId: transaction.orderId,
        buyerFirstName: transaction.buyerFirstName,
        buyerLastName: transaction.buyerLastName,
        paymentTypeId: transaction.paymentTypeId,
        shippingProviderId: transaction.shippingProviderId,
        shippingPostalCode: transaction.shippingPostalCode,
        platformId: transaction.platformId,
        isPaid: transaction.isPaid,
        updatedAt: new Date(),
    }).where(eq(schema.transaction.id, transaction.id)).returning();
    return result;
}

export const addTransaction = async (transaction: any) => {
    const result = await db.insert(schema.transaction).values(transaction).returning();
    return result[0];
}

export const deleteTransaction = async (transactionId: number) => {
    await db.delete(schema.transaction).where(eq(schema.transaction.id, transactionId)).returning({
        deletedId: schema.transaction.id,
    });
}
// #endregion

// #region Transaction Item
export const getTransactionItemsById = async (transactionId: number) => {
    const items = await db.query.transactionItem.findMany({
        where: eq(schema.transactionItem.transactionId, transactionId),
    });
    return items;
};

export const addTransactionItem = async (transactionItem: any) => {
    const result = await db.insert(schema.transactionItem).values(transactionItem).returning();
    return result[0];
}

export const editTransactionItem = async (transactionItem: any) => {
    const result = await db.update(schema.transactionItem).set({
        quantity: transactionItem.quantity,
        updatedAt: new Date(),
    }).where(and(eq(schema.transactionItem.transactionId, transactionItem.transactionId), eq(schema.transactionItem.productId, transactionItem.productId))).returning();
    return result;
}

export const deleteTransactionItem = async (transactionId: number, productId: number) => {
    await db.delete(schema.transactionItem).where(and(eq(schema.transactionItem.transactionId, transactionId), eq(schema.transactionItem.productId, productId)));
}
