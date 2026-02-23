import "@/config/env";
import db from "../db/connect";
import { reset } from "drizzle-seed";
import * as schema from "../db/schema";
import bcrypt from "bcryptjs";

const adminPassword = await bcrypt.hash("admin123", 10);

async function main() {
  console.log("Running TEST seeder...");

  await reset(db, schema);

  /* ========================
     1. USERS
  ======================== */

  await db.insert(schema.users).values([
    {
      username: "admin",
      password: adminPassword,
      role: "admin",
    },
    {
      username: "user",
      password: adminPassword,
      role: "user",
    },
  ]);

  /* ========================
     2. MASTER DATA
  ======================== */

  await db.insert(schema.productSize).values([
    { size: "S" },
    { size: "M" },
    { size: "L" },
  ]);

  await db.insert(schema.productColor).values([
    { color: "Red" },
    { color: "Blue" },
    { color: "Black" },
  ]);

  await db.insert(schema.platform).values([
    { platformName: "Shopee" },
    { platformName: "Lazada" },
  ]);

  await db.insert(schema.paymentType).values([
    { paymentType: "Credit Card" },
    { paymentType: "COD" },
  ]);

  /* ========================
     3. PRODUCTS (25 for pagination)
  ======================== */

  const products = Array.from({ length: 25 }).map((_, i) => ({
    productName: `Test Product ${i + 1}`,
  }));

  await db.insert(schema.product).values(products);

  /* ========================
     4. PRODUCT VARIANTS
     1 variant per product
  ======================== */

  const variants = Array.from({ length: 25 }).map((_, i) => ({
    productId: i + 1,
    sizeId: ((i % 3) + 1),   // rotate size
    colorId: ((i % 3) + 1),  // rotate color
    qty: 50 + i,
    minStock: 10,
  }));

  await db.insert(schema.productVariant).values(variants);

  /* ========================
     5. DAILY UPLOAD LOG
  ======================== */

  await db.insert(schema.dailyUploadLog).values({
    uploadAt: new Date(),
  });

    /* ========================
     5. TRANSACTIONS
  ======================== */

  const statuses = [
    "order placed",
    "shipped",
    "delivered",
    "completed",
    "cancelled",
  ] as const;

  const transactions = Array.from({ length: 10 }).map((_, i) => ({
    orderId: `ORD-000${i + 1}`,
    buyer: `Buyer ${i + 1}`,
    paymentTypeId: (i % 2) + 1,  // 1 or 2
    platformId: (i % 2) + 1,     // 1 or 2
    status: statuses[i % statuses.length],
    note: `Test transaction ${i + 1}`,
  }));

  await db.insert(schema.transaction).values(transactions);

  /* ========================
     6. TRANSACTION ITEMS
     1–3 items per transaction
  ======================== */

  const transactionItems = [];

  for (let i = 1; i <= 10; i++) {
    const numberOfItems = (i % 3) + 1; // 1–3 items

    for (let j = 0; j < numberOfItems; j++) {
      const productId = ((i + j) % 25) + 1;

      transactionItems.push({
        transactionId: i,
        productId: productId,
        productVariantId: productId, // เพราะเรา 1 variant ต่อ product
        quantity: (j + 1) * 2,
      });
    }
  }

  await db.insert(schema.transactionItem).values(transactionItems);

  console.log("TEST seeding completed.");
}

main();