import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const roles = t.pgEnum("roles", ['admin', 'user', 'manager'])

export const users = pgTable("users", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    username: t.varchar().notNull(),
    password: t.varchar().notNull(),
    refreshToken: t.varchar('refresh_token'),
    role: roles().notNull(),
    firstName: t.varchar('first_name').notNull(),
    lastName: t.varchar('last_name').notNull(),
    createdAt: t.timestamp('created_at').defaultNow(),
})

export const product = pgTable("product", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    productName: t.varchar('product_name').notNull(),
    productSizeId: t.integer('product_size_id').references(() => productSize.id).notNull(),
    productColorId: t.integer('product_color_id').references(() => productColor.id).notNull(),
    productQty: t.integer('product_qty').notNull(),
    updatedAt: t.timestamp('updated_at').notNull().defaultNow(),
    createdAt: t.timestamp('created_at').defaultNow().notNull(),
})

export const productSize = pgTable("product_size", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    size: t.varchar(),
    updatedAt: t.timestamp('updated_at').notNull().defaultNow(),
    createdAt: t.timestamp('created_at').defaultNow().notNull(),
})

export const productColor = pgTable("product_color", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    color: t.varchar(),
    updatedAt: t.timestamp('updated_at').notNull().defaultNow(),
    createdAt: t.timestamp('created_at').defaultNow().notNull(),
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
    updatedAt: t.timestamp('updated_at').notNull().defaultNow(),
    createdAt: t.timestamp('created_at').defaultNow(),
})

export const paymentType = pgTable("payment_type", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    paymentType: t.varchar('payment_type'),
    updatedAt: t.timestamp('updated_at').notNull().defaultNow(),
    createdAt: t.timestamp('created_at').defaultNow().notNull(),
})

export const shippingProvider = pgTable("shipping_provider", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    shippingProvider: t.varchar('shipping_provider'),
    updatedAt: t.timestamp('updated_at').notNull().defaultNow(),
    createdAt: t.timestamp('created_at').defaultNow().notNull(),
})

export const platform = pgTable("platform", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    platformName: t.varchar('platform_name'),
    updatedAt: t.timestamp('updated_at').notNull().defaultNow(),
    createdAt: t.timestamp('created_at').defaultNow().notNull(),
})

export const transactionItem = pgTable("transaction_item", {
    transactionId: t.integer('transaction_id').notNull().references(() => transaction.id),
    productId: t.integer('product_id').notNull().references(() => product.id),
    quantity: t.integer(),
}, (table) => [
    t.primaryKey({ columns: [table.transactionId, table.productId] })
]);