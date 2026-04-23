import "@/config/env";
import db from "./connect";
import { reset } from "drizzle-seed";
import * as schema from "./schema";
import * as bcrypt from "bcryptjs";

/* =========================
   MASTER DATA
========================= */
const sizes = ["No Size"];
const colors = ["No Color"];
const platforms = ["Shopee", "Lazada", "TikTok Shop"];
const paymentTypes = ["Credit Card", "COD", "Bank Transfer"];

/* =========================
   PRODUCT MAPPINGS
========================= */
const mappings = [
  {
    productName: "1-6 Dice Roller V.2",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "4 in Row",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Airplane Puzzle",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [], // ❌ เอา SKU ออก
  },
  {
    productName: "Backgammon",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Black & White Chess",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Black & White Chess V.2",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Calendar",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Card",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Chain Triangle Game",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Chess",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Chess 4 in 1",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Chinese Chess",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Connect Four",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Connect Four V.2",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Domino",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "English Chess V.3",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Escape",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Folding Chinese Checkers",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Horse Race",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Jackpot",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Jackpot 4 Player",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Jenga / Genga",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Kalaha",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Magnetic Chess",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Snake & Ladder",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
];

/* =========================
   RESET SEQUENCE
========================= */
async function resetIdentitySequences() {
  const tables = [
    "users",
    "product",
    "product_size",
    "product_color",
    "product_variant",
    "payment_type",
    "platform",
    "transaction",
    "transaction_item",
    "platform_product_mapping",
    "daily_upload_log",
  ];

  for (const table of tables) {
    await db.execute(`
      SELECT setval(
        pg_get_serial_sequence('"${table}"', 'id'),
        1,
        false
      );
    `);
  }
}


/* =========================
   MAIN
========================= */
async function main() {
  console.log("Seeding...");

  await reset(db, schema);
  await resetIdentitySequences();

  const password = await bcrypt.hash("admin123", 10);

  // ✅ ใช้ค่าเดียวกันทั้งหมด
  const fixedDate = new Date("2026-01-01T00:00:00.000Z");
  const DEFAULT_QTY = 50;
  const DEFAULT_MIN_STOCK = 10;

  /* ---------- master ---------- */
  const insertedSizes = await db.insert(schema.productSize)
    .values(sizes.map((s) => ({ size: s, createdAt: fixedDate })))
    .returning();

  const sizeMap = Object.fromEntries(insertedSizes.map((s) => [s.size, s.id]));

  const insertedColors = await db.insert(schema.productColor)
    .values(colors.map((c) => ({ color: c, createdAt: fixedDate })))
    .returning();

  const colorMap = Object.fromEntries(insertedColors.map((c) => [c.color, c.id]));

  await db.insert(schema.platform)
    .values(platforms.map((p) => ({ platformName: p, createdAt: fixedDate })));

  await db.insert(schema.paymentType)
    .values(paymentTypes.map((p) => ({ paymentType: p, createdAt: fixedDate })));

  /* ---------- product ---------- */
  const insertedProducts = await db.insert(schema.product)
    .values(mappings.map((m) => ({ productName: m.productName })))
    .returning();

  const productMap = Object.fromEntries(insertedProducts.map((p) => [p.productName, p.id]));

  /* ---------- variant ---------- */
  const variantRows: any[] = [];

  for (const p of mappings) {
    const productId = productMap[p.productName];

    for (const v of p.variants) {
      variantRows.push({
        productId,
        sizeId: sizeMap[v.size],
        colorId: colorMap[v.color],
        qty: DEFAULT_QTY,
        minStock: DEFAULT_MIN_STOCK,
        updatedAt: fixedDate,
      });
    }
  }

  await db.insert(schema.productVariant).values(variantRows);

  /* ---------- user ---------- */
  await db.insert(schema.users).values([
    { username: "admin", password, role: "admin" },
    { username: "user", password, role: "user" },
  ]);

  /* ---------- transaction (April 25 - uniform data) ---------- */

// ใช้ค่าเดียว
const insertedPlatforms = await db.select().from(schema.platform);
const platformId = insertedPlatforms[0]!.id; // เช่น Shopee

const paymentTypeList = await db.select().from(schema.paymentType);
const paymentTypeId = paymentTypeList[0]!.id; // เช่น Credit Card

const productVariantList = await db.select().from(schema.productVariant);

// 👉 createdAt เหมือนกันหมด
const fixedTransactionDate = new Date("2026-04-01T00:00:00.000Z");

const transactionRows: any[] = [];
const transactionItemRows: any[] = [];

for (let i = 0; i < 25; i++) {
  const orderId = `ORD-${String(i + 1).padStart(3, "0")}`;

  transactionRows.push({
    orderId,
    buyer: `Buyer ${i + 1}`,
    paymentTypeId,
    shippingPostalCode: "50000",
    platformId,
    status: "completed",
    note: null,
    createdAt: fixedTransactionDate,
    updatedAt: fixedTransactionDate,
  });
}

const insertedTransactions = await db
  .insert(schema.transaction)
  .values(transactionRows)
  .returning();

/* ---------- transaction items (1 ต่อ 1) ---------- */
for (let i = 0; i < insertedTransactions.length; i++) {
  const trx = insertedTransactions[i];

  const variant = productVariantList[i % productVariantList.length];

  transactionItemRows.push({
    transactionId: trx!.id,
    productId: variant!.productId,
    productVariantId: variant!.id,
    quantity: 1,
    createdAt: trx!.createdAt,
    updatedAt: trx!.createdAt,
  });
}

await db.insert(schema.transactionItem).values(transactionItemRows);

  console.log("✅ Seeding completed.");
}

main();