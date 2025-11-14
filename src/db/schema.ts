import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const roles = t.pgEnum("roles", ['admin', 'user', 'manager'])

export const users = pgTable("users", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    username: t.varchar().notNull(),
    password: t.varchar().notNull(),
    role: roles(),
    firstName: t.varchar(),
    lastName: t.varchar(),
    createdAt: t.timestamp().defaultNow(),
})

export const product = pgTable("product", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    productName: t.varchar(),
    productSizeId: t.integer().references(() => productSize.id),
    productColorId: t.integer().references(() => productColor.id),
    productQty: t.integer(),
    updatedAt: t.timestamp(),
})

export const productSize = pgTable("product_size", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    size: t.varchar(),
})

export const productColor = pgTable("product_color", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    color: t.varchar(),
})

export const transaction = pgTable("transaction", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    orderId: t.varchar(),
    buyerFirstName: t.varchar(),
    buyerLastName: t.varchar(),
    paymentTypeId: t.integer().references(() => paymentType.id),
    shippingProviderId: t.integer().references(() => shippingProvider.id),
    shippingPostalCode: t.varchar(),
    platformId: t.integer().references(() => platform.id),
    isPaid: t.boolean(),
    createdAt: t.timestamp().defaultNow(),
})

export const paymentType = pgTable("payment_type", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    paymentType: t.varchar(),
})

export const shippingProvider = pgTable("shipping_provider", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    shippingProvider: t.varchar(),
})

export const platform = pgTable("platform", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    platformName: t.varchar(),
})

export const transactionItem = pgTable("transaction_item", {
    transactionId: t.integer().notNull().references(() => transaction.id),
    productId: t.integer().notNull().references(() => product.id),
    quantity: t.integer(),
}, (table) => [
    t.primaryKey({ columns: [table.transactionId, table.productId] })
]);