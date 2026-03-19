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

    /* ========================
     7. EXTRA TRANSACTIONS (2026/01)
  ======================== */

const januaryTransactions = await db
  .insert(schema.transaction)
  .values([
    {
      orderId: "ORD-2026-001",
      buyer: "January Buyer 1",
      paymentTypeId: 1,
      platformId: 1,
      status: "completed",
      note: "January test 1",
      createdAt: new Date("2026-01-10T10:00:00Z"),
    },
    {
      orderId: "ORD-2026-002",
      buyer: "January Buyer 2",
      paymentTypeId: 2,
      platformId: 2,
      status: "completed",
      note: "January test 2",
      createdAt: new Date("2026-01-20T14:30:00Z"),
    },
  ])
  .returning({
    id: schema.transaction.id,
    createdAt: schema.transaction.createdAt,
  });

  /* ========================
     8. TRANSACTION ITEMS (2026/01)
  ======================== */

await db.insert(schema.transactionItem).values([
  {
    transactionId: januaryTransactions[0]!.id!,
    productId: 1,
    productVariantId: 1,
    quantity: 3,
    createdAt: januaryTransactions[0]!.createdAt!,
  },
  {
    transactionId: januaryTransactions[1]!.id!,
    productId: 2,
    productVariantId: 2,
    quantity: 4,
    createdAt: januaryTransactions[1]!.createdAt!,
  },
]);

/* ========================
   9. EXTRA TRANSACTIONS (2026/02 - 25 TOTAL)
======================== */

const februaryTransactionsData = Array.from({ length: 25 }).map((_, i) => ({
  orderId: `ORD-2026-02-${String(i + 1).padStart(3, "0")}`,
  buyer: `February Buyer ${i + 1}`,
  paymentTypeId: (i % 2) + 1,
  platformId: (i % 2) + 1,
  status: statuses[i % statuses.length],
  note: `February 2026 transaction ${i + 1}`,
  createdAt: new Date(
    `2026-02-${String((i % 28) + 1).padStart(2, "0")}T10:00:00Z`
  ),
}));

const februaryTransactions = await db
  .insert(schema.transaction)
  .values(februaryTransactionsData)
  .returning({
    id: schema.transaction.id,
    createdAt: schema.transaction.createdAt,
  });

/* ========================
   10. TRANSACTION ITEMS (2026/02)
======================== */

const februaryItems = [];

for (let i = 0; i < februaryTransactions.length; i++) {
  const numberOfItems = (i % 3) + 1; // 1–3 items per transaction

  for (let j = 0; j < numberOfItems; j++) {
    const productId = ((i + j) % 25) + 1;

    februaryItems.push({
      transactionId: februaryTransactions[i]!.id!,
      productId: productId,
      productVariantId: productId,
      quantity: (j + 1) * 2,
      createdAt: februaryTransactions[i]!.createdAt!,
    });
  }
}

await db.insert(schema.transactionItem).values(februaryItems);

  console.log("TEST seeding completed.");
}

main();