import db from "@/db/connect";
import * as schema from "@/db/schema";
import type { TransactionStatus } from "@/models/transaction";
import { and, eq, sql, desc } from "drizzle-orm";

// #region Transaction
export const getAllTransactions = async () => {
  const transactions = await db.query.transaction.findMany();
  return transactions;
};

export const getTransactionById = async (transactionId: number) => {
  const transaction = await db.query.transaction.findFirst({
    where: eq(schema.transaction.id, transactionId),
  });
  return transaction;
};

export const getTransactionByOrderId = async (orderId: string) => {
  const transaction = await db.query.transaction.findFirst({
    where: eq(schema.transaction.orderId, orderId),
  });
  return transaction;
};

export const editTransaction = async (transaction: any) => {
  const result = await db
    .update(schema.transaction)
    .set({
      orderId: transaction.orderId,
      buyer: transaction.buyer,
      paymentTypeId: transaction.paymentTypeId,
      shippingPostalCode: transaction.shippingPostalCode,
      platformId: transaction.platformId,
      status: transaction.status,
      updatedAt: new Date(),
    })
    .where(eq(schema.transaction.id, transaction.id))
    .returning();
  return result;
};

export const editTransactionStatus = async (
  orderId: string,
  status: TransactionStatus
) => {
  const result = await db
    .update(schema.transaction)
    .set({
      status: status,
      updatedAt: new Date(),
    })
    .where(eq(schema.transaction.orderId, orderId))
    .returning();
  return result;
};

export const addTransaction = async (transaction: any) => {
  const result = await db
    .insert(schema.transaction)
    .values(transaction)
    .returning({
      insertedId: schema.transaction.id,
      orderId: schema.transaction.orderId,
    });
  return result[0];
};

export const addMultipleTransactions = async (transactions: any[]) => {
  const result = await db
    .insert(schema.transaction)
    .values(transactions)
    .returning({
      insertedId: schema.transaction.id,
      orderId: schema.transaction.orderId,
    });
  return result;
};

export const deleteTransaction = async (transactionId: number) => {
  await db
    .delete(schema.transaction)
    .where(eq(schema.transaction.id, transactionId))
    .returning({
      deletedId: schema.transaction.id,
    });
};
// #endregion

// #region Transaction Item
export const getTransactionItemsById = async (transactionId: number) => {
  const items = await db.query.transactionItem.findMany({
    where: eq(schema.transactionItem.transactionId, transactionId),
  });
  return items;
};

export const addTransactionItem = async (transactionItem: any) => {
  const result = await db
    .insert(schema.transactionItem)
    .values(transactionItem)
    .returning();
  return result[0];
};

export const addMultipleTransactionItems = async (transactionItems: any[]) => {
  const result = await db
    .insert(schema.transactionItem)
    .values(transactionItems)
    .returning();
  return result;
};

export const editTransactionItem = async (transactionItem: any) => {
  const result = await db
    .update(schema.transactionItem)
    .set({
      quantity: transactionItem.quantity,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(schema.transactionItem.transactionId, transactionItem.transactionId),
        eq(schema.transactionItem.productId, transactionItem.productId)
      )
    )
    .returning();
  return result;
};

export const deleteTransactionItem = async (
  transactionId: number,
  productId: number,
  productVariantId: number
) => {
  await db
    .delete(schema.transactionItem)
    .where(
      and(
        eq(schema.transactionItem.transactionId, transactionId),
        eq(schema.transactionItem.productId, productId),
        eq(schema.transactionItem.productVariantId, productVariantId)
      )
    );
};
// #endregion

// #region Dashboard
export const countOrders = async () => {
  return db.select({ count: sql<number>`count(*)` }).from(schema.transaction);
};

export const sumUnitsSold = async () => {
  return db
    .select({
      total: sql<number>`sum(${schema.transactionItem.quantity})`,
    })
    .from(schema.transactionItem);
};


export const topSoldProducts = async () => {
  const totalSold = sql<number>`sum(${schema.transactionItem.quantity})`;

  return db
    .select({
      productId: schema.product.id,
      productName: schema.product.productName,
      totalSold,
    })
    .from(schema.transactionItem)
    .innerJoin(
      schema.product,
      eq(schema.transactionItem.productId, schema.product.id)
    )
    .groupBy(
      schema.product.id,
      schema.product.productName
    )
    .orderBy(desc(totalSold))
    .limit(5);
};

export const salesByPlatform = async () => {
  return db
    .select({
      platform: schema.platform.platformName,
      total: sql<number>`count(${schema.transaction.id})`,
    })
    .from(schema.transaction)
    .leftJoin(
      schema.platform,
      eq(schema.transaction.platformId, schema.platform.id)
    )
    .groupBy(schema.platform.platformName);
};

export const getOrderStatusBreakdown = async () => {
  return db
    .select({
      status: schema.transaction.status,
      count: sql<number>`count(*)`,
    })
    .from(schema.transaction)
    .where(
      sql`${schema.transaction.status} in ('completed', 'cancelled', 'returned')`
    )
    .groupBy(schema.transaction.status);
};
