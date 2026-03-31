import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const roles = t.pgEnum("roles", ["admin", "user", "manager"]);

export const status = t.pgEnum("status", [
  "order placed",
  "shipped",
  "delivered",
  "completed",
  "cancelled",
  "returned",
]);

export const users = pgTable("users", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  username: t.varchar().notNull().unique(),
  password: t.varchar().notNull(),
  role: roles().notNull(),
  createdAt: t.timestamp("created_at").defaultNow(),
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  userId: t
    .integer("user_id")
    .notNull()
    .references(() => users.id)
    .unique(),
  token: t.varchar().notNull(),
  expiresAt: t.timestamp("expires_at").notNull(),
  createdAt: t.timestamp("created_at").defaultNow(),
});

export const product = pgTable("product", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  productName: t.varchar("product_name").notNull(),
  imageUrl: t.varchar("image_url"),
  updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
});

export const productVariant = pgTable("product_variant", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  productId: t
    .integer("product_id")
    .notNull()
    .references(() => product.id),
  colorId: t.integer("color_id").references(() => productColor.id),
  sizeId: t.integer("size_id").references(() => productSize.id),
  qty: t.integer("qty").notNull(),
  minStock: t.integer("min_stock").notNull(),
  imageUrl: t.varchar("image_url"),
  updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
});

export const productSize = pgTable("product_size", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  size: t.varchar(),
  updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
});

export const productColor = pgTable("product_color", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  color: t.varchar(),
  updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
});

export const transaction = pgTable("transaction", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  orderId: t.varchar("order_id").notNull().unique(),
  buyer: t.varchar("buyer"),
  paymentTypeId: t.integer("payment_type_id").references(() => paymentType.id),
  shippingPostalCode: t.varchar("shipping_postal_code"),
  platformId: t.integer("platform_id").references(() => platform.id),
  status: status().notNull().default("order placed"),
  note: t.varchar("note"),
  updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
  createdAt: t.timestamp("created_at").defaultNow(),
});

export const paymentType = pgTable("payment_type", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  paymentType: t.varchar("payment_type"),
  updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
});

export const platform = pgTable("platform", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  platformName: t.varchar("platform_name"),
  updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
});

export const transactionItem = pgTable("transaction_item", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  transactionId: t
    .integer("transaction_id")
    .notNull()
    .references(() => transaction.id),
  productId: t.integer("product_id").notNull(),
  productVariantId: t.integer("product_variant_id").notNull(),
  quantity: t.integer(),
  externalProductSku: t.varchar("external_product_sku"),
  externalVariantText: t.varchar("external_variant_text"),
  updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
});

export const dailyUploadLog = pgTable("daily_upload_log", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  uploadAt: t.timestamp("upload_at").notNull(),
});

export const platformProductMapping = pgTable(
  "platform_product_mapping",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    platformId: t
      .integer("platform_id")
      .notNull()
      .references(() => platform.id),
    externalProductSku: t.varchar("external_product_sku").notNull(),
    productId: t
      .integer("product_id")
      .notNull()
      .references(() => product.id),
    createdAt: t.timestamp("created_at").defaultNow().notNull(),
  }
);
