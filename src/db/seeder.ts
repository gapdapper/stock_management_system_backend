import "@/config/env";
import db from "../db/connect";
import { reset } from "drizzle-seed";
import * as schema from "../db/schema";
import * as bcrypt from "bcryptjs";


const productNames = [
  "Jenga / Genga",
  "Domino",
  "Sling Shot Game",
  "Ludo - Plug In",
  "Shut the Box / Jackpot 4 Players",
  "4 in row / Bingo",
  "Santa Christmas Party Train",
  "Thai Chess",
  "Magnetic Snake & Ladder",
  "Magnetic Backgammon",
  "Kalaha",
  "English Chess with Draught Pieces",
  "Plastic Chess Pieces",
  "Shut the Box / Jackpot Game",
  "Calendar Wooden Block",
  "Magnetic Checkers V.2",
  "1-6 Dice Roller V.2",
  "Othello",
  "Tic Tac Toe",
  "Draught Board",
  "Snake Cube",
  "Thai Chess Piece Plastic",
  "Classic Card Wooden Toy Game",
  "Horse Race",
  "Snake Ladder",
  "Chess",
  "Connect Four",
  "Magnet Othello",
  "Shut the Box / Jackpot 6 Players",
  "Thai Chess (Makruk Thai) Set",
  "Folding Chinese Checkers",
  "Number Jenga / Genga",
  "Match 16",
  "Black & White Chess",
  "Thai Chess Pieces",
  "Escape",
  "Puppy Puzzle",
  "Chinese Chess",
  "Mahjong",
  "Wooden Pool Game",
  "Chess Pieces",
  "English Chess with Draught Pieces V.2",
  "3 in 1 Magnetic Board Game",
  "English Magnetic Chess with Draught Pieces",
  "Black & White Chess V.2",
  "Super Combo Chess (English & Thai) V.2",
  "Super Combo Chess (English & Thai)",
  "English Chess V.3",
  "Magnetic Chinese Chess",
  "Ludo - Ball",
  "Pull & Push Along Elephant",
  "Draught Board with Chess Pieces",
  "Chess Pieces Set",
  "The Airplane Puzzle",
  "Magnetic Checkers",
  "Magnetic Chess",
  "Chain Triangle Chess Game",
  "Draught Board with Thai Chess Pieces",
  "Super Combo Chess (English & Thai) V.3",
  "Connect Four V.2",
  "3 in 1 Magnetic Board Game (Backgammon + Chess + Checkers)",
  "Heart Tangram Puzzle",
  "Chess Set 4 in 1"
];

// ข้อมูล Master Data อื่นๆ ที่ควรเรียงลำดับ ID
const sizes = ["Size S", "Size M", "Size L", "Size XL", "No Size"];
const colors = [
  "Red",
  "Blue",
  "Green",
  "Orange",
  "Red-White",
  "Black-White",
  "New Red",
  "New Green",
  "Colorful",
  "6-point",
  "9-point",
  "12-point",
  "White",
  "No Color",
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

const productSeederConfig = [
  {
    id: 1,
    allowedColors: [9, 14],
    allowedSizes: [1, 2, 3, 4, 5],
  },
  {
    id: 2,
    allowedColors: [10, 11, 12, 14],
    allowedSizes: [1, 5, 3],
  },
  { id: 3, allowedColors: [14], allowedSizes: [5] },
  { id: 4, allowedColors: [14], allowedSizes: [2, 3] },
  { id: 5, allowedColors: [9, 14, 2, 3, 7, 8, 1], allowedSizes: [5] },
  { id: 6, allowedColors: [14], allowedSizes: [5] },
  { id: 7, allowedColors: [1, 3, 13], allowedSizes: [5] },
  { id: 8, allowedColors: [14], allowedSizes: [3, 4, 5] },
  { id: 9, allowedColors: [4, 2, 3], allowedSizes: [2, 3, 1] },
  { id: 10, allowedColors: [14], allowedSizes: [5] },
  { id: 11, allowedColors: [14], allowedSizes: [2, 3] },
  { id: 12, allowedColors: [14], allowedSizes: [5] },
  { id: 13, allowedColors: [14], allowedSizes: [5] },
  { id: 14, allowedColors: [1, 2, 3], allowedSizes: [1, 3] },
  { id: 15, allowedColors: [14], allowedSizes: [5] },
  { id: 16, allowedColors: [14], allowedSizes: [5] },
  { id: 17, allowedColors: [14], allowedSizes: [5] },
  { id: 18, allowedColors: [14], allowedSizes: [5] },
  { id: 19, allowedColors: [14], allowedSizes: [5] },
  { id: 20, allowedColors: [14], allowedSizes: [5] },
  { id: 21, allowedColors: [14], allowedSizes: [5] },
  { id: 22, allowedColors: [6, 5], allowedSizes: [5] },
  { id: 23, allowedColors: [14], allowedSizes: [5] },
  { id: 24, allowedColors: [14], allowedSizes: [5] },
  { id: 25, allowedColors: [14], allowedSizes: [5] },
  { id: 26, allowedColors: [14], allowedSizes: [3, 1, 2, 4] },
  { id: 27, allowedColors: [14], allowedSizes: [5] },
  { id: 28, allowedColors: [14], allowedSizes: [5] },
  { id: 29, allowedColors: [3, 9], allowedSizes: [5] },
  { id: 30, allowedColors: [6, 5], allowedSizes: [5] },
  { id: 31, allowedColors: [14], allowedSizes: [1, 2] },
  { id: 32, allowedColors: [14], allowedSizes: [3] },
  { id: 33, allowedColors: [14], allowedSizes: [5] },
  { id: 34, allowedColors: [14], allowedSizes: [2, 3] },
  { id: 35, allowedColors: [14], allowedSizes: [4] },
  { id: 36, allowedColors: [14], allowedSizes: [2, 3] },
  { id: 37, allowedColors: [14], allowedSizes: [5] },
  { id: 38, allowedColors: [14], allowedSizes: [5] },
  { id: 39, allowedColors: [14], allowedSizes: [5] },
  { id: 40, allowedColors: [1, 2, 3], allowedSizes: [5] },
  { id: 41, allowedColors: [14], allowedSizes: [4] },
  { id: 42, allowedColors: [14], allowedSizes: [5] },
  { id: 43, allowedColors: [14], allowedSizes: [5] },
  { id: 44, allowedColors: [14], allowedSizes: [5] },
  { id: 45, allowedColors: [14], allowedSizes: [5] },
  { id: 46, allowedColors: [5, 6], allowedSizes: [5] },
  { id: 47, allowedColors: [5, 6], allowedSizes: [5] },
  { id: 48, allowedColors: [14], allowedSizes: [5] },
  { id: 49, allowedColors: [14], allowedSizes: [5] },
  { id: 50, allowedColors: [14], allowedSizes: [5] },
  { id: 51, allowedColors: [14], allowedSizes: [5] },
  { id: 52, allowedColors: [14], allowedSizes: [5] },
  { id: 53, allowedColors: [14], allowedSizes: [4] },
  { id: 54, allowedColors: [14], allowedSizes: [5] },
  { id: 55, allowedColors: [14], allowedSizes: [5] },
  { id: 56, allowedColors: [14], allowedSizes: [5] },
  { id: 57, allowedColors: [14], allowedSizes: [5] },
  { id: 58, allowedColors: [14], allowedSizes: [4] },
  { id: 59, allowedColors: [14], allowedSizes: [4] },
  { id: 60, allowedColors: [14], allowedSizes: [5] },
  { id: 61, allowedColors: [14], allowedSizes: [5] },
  { id: 62, allowedColors: [14], allowedSizes: [5] },
  { id: 63, allowedColors: [14], allowedSizes: [5] },
];

export function buildProductVariants() {
  let result = [];

  for (const config of productSeederConfig) {
    for (const colorId of config.allowedColors) {
      for (const sizeId of config.allowedSizes) {
        result.push({
          productId: config.id,
          colorId: colorId,
          sizeId: sizeId,
        });
      }
    }
  }

  return result;
}

const productVariant = buildProductVariants();

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
  ];

  for (const table of tables) {
    await db.execute(`
            SELECT setval(
                pg_get_serial_sequence('"${table}"', 'id'),
                (SELECT max(id) FROM "${table}"));
        `);
  }

  console.log("Identity sequences reset.");
}

async function main() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 10);


  await resetIdentitySequences();
  await reset(db, schema);

  // Manually insert transaction items to link products and transactions
  await db.insert(schema.product).values(
    productNames.map((name) => ({
      productName: name,
    }))
  );

  // Size
  await db.insert(schema.productSize).values(sizes.map((s) => ({ size: s })));

  // Color
  await db
    .insert(schema.productColor)
    .values(colors.map((c) => ({ color: c })));

  await db.insert(schema.productVariant).values(
    productVariant.map((pv) => ({
      productId: pv.productId,
      sizeId: pv.sizeId,
      colorId: pv.colorId,
      qty: 50,
      minStock: 10
    }))
  );

  // Platform
  await db
    .insert(schema.platform)
    .values(platforms.map((p) => ({ platformName: p })));

  // Payment Type
  await db
    .insert(schema.paymentType)
    .values(paymentTypes.map((pt) => ({ paymentType: pt })));

  await db.insert(schema.dailyUploadLog).values(
    { uploadAt: new Date()}
  );

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

  await resetIdentitySequences();

  console.log("Seeding completed.");
}

main();
