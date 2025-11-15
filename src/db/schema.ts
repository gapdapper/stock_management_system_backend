import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const roles = t.pgEnum("roles", ['admin', 'user', 'manager'])

export const users = pgTable("users", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    username: t.varchar().notNull(),
    password: t.varchar().notNull(),
    role: roles(),
    firstName: t.varchar('first_name'),
    lastName: t.varchar('last_name'),
    createdAt: t.timestamp('created_at').defaultNow(),
})

export const product = pgTable("product", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    productName: t.varchar('product_name'),
    productSizeId: t.integer('product_size_id').references(() => productSize.id),
    productColorId: t.integer('product_color_id').references(() => productColor.id),
    productQty: t.integer('product_qty'),
    updatedAt: t.timestamp('updated_at'),
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
    orderId: t.varchar('order_id'),
    buyerFirstName: t.varchar('buyer_first_name'),
    buyerLastName: t.varchar('buyer_last_name'),
    paymentTypeId: t.integer('payment_type_id').references(() => paymentType.id),
    shippingProviderId: t.integer('shipping_provider_id').references(() => shippingProvider.id),
    shippingPostalCode: t.varchar('shipping_postal_code'),
    platformId: t.integer('platform_id').references(() => platform.id),
    isPaid: t.boolean('is_paid').default(false),
    createdAt: t.timestamp('created_at').defaultNow(),
})

export const paymentType = pgTable("payment_type", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    paymentType: t.varchar('payment_type'),
})

export const shippingProvider = pgTable("shipping_provider", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    shippingProvider: t.varchar('shipping_provider'),
})

export const platform = pgTable("platform", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    platformName: t.varchar('platform_name'),
})

export const transactionItem = pgTable("transaction_item", {
    transactionId: t.integer('transaction_id').notNull().references(() => transaction.id),
    productId: t.integer('product_id').notNull().references(() => product.id),
    quantity: t.integer(),
}, (table) => [
    t.primaryKey({ columns: [table.transactionId, table.productId] })
]);