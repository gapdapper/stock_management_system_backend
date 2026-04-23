import "@/config/env";
import db from "./connect";
import { reset } from "drizzle-seed";
import * as schema from "./schema";
import * as bcrypt from "bcryptjs";

/* =========================
   MASTER DATA
========================= */
const sizes = [
  "Size S", // 1
  "Size M", // 2
  "Size L", // 3
  "Size XL", // 4
  "No Size", // 5
  "Size M V2", // 6
  "Size L V2", // 7
];

const colors = [
  "Red", // 1
  "Blue", // 2
  "Green", // 3
  "Orange", // 4
  "Red White", // 5
  "Black White", // 6
  "New Red", // 7
  "New Green", // 8
  "Colorful", // 9
  "6 Point", // 10
  "9 Point", // 11
  "12 Point", // 12
  "White", // 13
  "No Color", // 14
];
const platforms = ["Shopee", "Lazada", "TikTok Shop"];
const paymentTypes = [
  "Credit Card",
  "Bank Transfer",
  "Promptpay",
  "COD",
  "TMN Express",
  "Shopee Wallet",
  "Airpay Wallet",
  "Airpay Credit Card",
  "Shopee Credit",
  "TikTok Pay Later",
  "Shopee Pay Later",
  "Other",
  "Shopee Pay",
  "True Money",
];

/* =========================
   PRODUCT MAPPINGS
========================= */
const mappings = [
  {
    productName: "4 in Row",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Backgammon",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "Shopee", sku: "backgammon" },
      { platform: "Lazada", sku: "5386363293" },
      { platform: "TikTok Shop", sku: "backgammon" },
    ],
  },

  // ⭐ multi-variant + มี SKU (test expand + mapping)
  {
    productName: "Chess",
    variants: [
      { size: "Size S", color: "No Color" },
      { size: "Size S", color: "Red" },
      { size: "Size S", color: "Blue" },
      { size: "Size S", color: "Green" },
      { size: "Size M", color: "No Color" },
      { size: "Size L", color: "No Color" },
    ],
    platforms: [],
  },

  {
    productName: "Chess 4 in 1",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Domino",
    variants: [{ size: "Size S", color: "No Color" }],
    platforms: [],
  },
  {
    productName: "Jenga / Genga",
    variants: [{ size: "Size S", color: "No Color" }],
    platforms: [],
  },

  // ⭐ มี SKU (test mapping อีก case)
  {
    productName: "Snake & Ladder",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "Shopee", sku: "snakeladder" },
      { platform: "Lazada", sku: "2882093449" },
      { platform: "TikTok Shop", sku: "snakeladder" },
    ],
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

  const fixedDate = new Date("2026-01-01T00:00:00.000Z");

  /* ---------- master ---------- */
  const insertedSizes = await db.insert(schema.productSize)
    .values(sizes.map((s) => ({ size: s, createdAt: fixedDate })))
    .returning();

  const sizeMap = Object.fromEntries(insertedSizes.map((s) => [s.size, s.id]));

  const insertedColors = await db.insert(schema.productColor)
    .values(colors.map((c) => ({ color: c, createdAt: fixedDate })))
    .returning();

  const colorMap = Object.fromEntries(insertedColors.map((c) => [c.color, c.id]));

  const insertedPlatforms = await db.insert(schema.platform)
    .values(platforms.map((p) => ({ platformName: p, createdAt: fixedDate })))
    .returning();

  const platformMap = Object.fromEntries(insertedPlatforms.map((p) => [p.platformName, p.id]));

  await db.insert(schema.paymentType)
    .values(paymentTypes.map((p) => ({ paymentType: p, createdAt: fixedDate })));

  /* ---------- product ---------- */
  const insertedProducts = await db.insert(schema.product)
    .values(mappings.map((m) => ({ productName: m.productName })))
    .returning();

  const productMap = Object.fromEntries(insertedProducts.map((p) => [p.productName, p.id]));

  /* ---------- variant + mapping ---------- */
  const variantRows: any[] = [];
  const mappingRows: any[] = [];

  let counter = 0;
  const baseDate = new Date(2026, 0, 1);

  const getDate = () => {
    const d = new Date(baseDate);
    d.setMinutes(d.getMinutes() + counter++);
    return d;
  };

  for (const p of mappings) {
    const productId = productMap[p.productName];

for (const v of p.variants) {
  let qty = 50;
  let minStock = 10;

  switch (p.productName) {
    case "Domino":
      qty = 0; // Out of stock
      break;

    case "Chess":
      qty = 5; // Low stock (multi-variant)
      break;

    case "Chess 4 in 1":
      qty = 9; // Low stock edge
      break;

    case "4 in Row":
      qty = 20;
      break;

    case "Backgammon":
      qty = 40;
      break;

    case "Jenga / Genga":
      qty = 60;
      break;

    case "Snake & Ladder":
      qty = 100; // Highest
      break;
  }

  variantRows.push({
    productId,
    sizeId: sizeMap[v.size],
    colorId: colorMap[v.color],
    qty,
    minStock,
    updatedAt: getDate(),
  });
}

    for (const plat of p.platforms) {
      mappingRows.push({
        productId,
        platformId: platformMap[plat.platform],
        externalProductSku: plat.sku,
      });
    }
  }

  await db.insert(schema.productVariant).values(variantRows);

  if (mappingRows.length > 0) {
    await db.insert(schema.platformProductMapping).values(mappingRows);
  }

  /* ---------- user ---------- */
  await db.insert(schema.users).values([
    { username: "admin", password, role: "admin" },
    { username: "user", password, role: "user" },
  ]);

  /* ---------- transaction ---------- */
const transactionSeed = [
  // --- January (3) ---
  { date: new Date(2026, 0, 1), platform: "Shopee", status: "order placed" },
  { date: new Date(2026, 0, 2), platform: "Lazada", status: "shipped" },
  { date: new Date(2026, 0, 3), platform: "TikTok Shop", status: "delivered" },

  // --- April (7) ---
  { date: new Date(2026, 3, 1), platform: "Shopee", status: "completed" },
  { date: new Date(2026, 3, 2), platform: "Lazada", status: "cancelled" },
  { date: new Date(2026, 3, 3), platform: "TikTok Shop", status: "returned" },
  { date: new Date(2026, 3, 4), platform: "Shopee", status: "order placed" },
  { date: new Date(2026, 3, 5), platform: "Lazada", status: "shipped" },
  { date: new Date(2026, 3, 6), platform: "TikTok Shop", status: "completed" },
  { date: new Date(2026, 3, 7), platform: "Shopee", status: "delivered" },
];

const productVariantList = await db.select().from(schema.productVariant);

const transactionRows: any[] = [];
const transactionItemRows: any[] = [];

for (let i = 0; i < transactionSeed.length; i++) {
  const seed = transactionSeed[i];

  const orderId = `ORD-2026-${String(i + 1).padStart(3, "0")}`;

  transactionRows.push({
    orderId,
    buyer: `Buyer ${i + 1}`,
    paymentTypeId: (i % 3) + 1,
    shippingPostalCode: "50000",
    platformId: platformMap[seed!.platform],
    status: seed!.status,
    note: null,
    createdAt: seed!.date,
    updatedAt: seed!.date,
  });
}

const insertedTransactions = await db
  .insert(schema.transaction)
  .values(transactionRows)
  .returning();

/* ---------- transaction items (April = 5 unique products) ---------- */

// 👉 เอา productId ไม่ซ้ำ 5 ตัว
const uniqueProducts = [
  ...new Map(productVariantList.map(v => [v.productId, v])).values()
].slice(0, 5); // ได้ variant ที่มี productId ไม่ซ้ำ

const topQuantities = [10, 9, 8, 7, 6];

let aprilIndex = 0;

for (let i = 0; i < insertedTransactions.length; i++) {
  const trx = insertedTransactions[i];
  const isApril = trx!.createdAt!.getMonth() === 3;

  let variant;
  let quantity;

  if (isApril) {

    const idx = aprilIndex % 5;
    variant = uniqueProducts[idx];


    if (aprilIndex < 5) {
      quantity = topQuantities[idx];
    } else {
      quantity = 2;
    }

    aprilIndex++;
  } else {

    variant = productVariantList[(i + 5) % productVariantList.length];
    quantity = 1;
  }

  transactionItemRows.push({
    transactionId: trx!.id,
    productId: variant!.productId,
    productVariantId: variant!.id,
    quantity,
    createdAt: trx!.createdAt,
    updatedAt: trx!.createdAt,
  });
}

await db.insert(schema.transactionItem).values(transactionItemRows);
/* ---------- daily upload log ---------- */
await db.insert(schema.dailyUploadLog).values([
  {
    uploadAt: new Date("2026-01-01T00:00:00.000Z"),
  },
]);
  console.log("✅ Seeding completed.");
}

main();