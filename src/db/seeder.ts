import '@/config/env';
import db from "../db/connect"
import { reset, seed } from "drizzle-seed";
import * as schema from "../db/schema";

async function resetIdentitySequences() {
    const tables = [
        "users",
        "product",
        "product_size",
        "product_color",
        "payment_type",
        "shipping_provider",
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

    await reset(db, schema)
    await seed(db, schema).refine((f) => ({
        users: {
            count: 0,
        },
        product: {
            columns: {
                productName: f.valuesFromArray({
                    values: ['Jackpot', '4 Players Jackpot', 'Jenga', 'Colorful Jenga', 'Domino', 'Tic Tac Toe', 'Ludo',],
                    isUnique: true,
                }),
                productQty: f.int({
                    minValue: 1,
                    maxValue: 100,
                })
            },
            count: 7
        },
        productSize: {
            columns: {
                size: f.valuesFromArray({
                    values: ['S', 'M', 'L', 'XL'],
                    isUnique: true,
                })
            },
            count: 4
        },
        productColor: {
            columns: {
                color: f.valuesFromArray({
                    values: ['Red', 'Blue', 'Green', 'Colorful'],
                    isUnique: true,
                })
            },
            count: 4
        },
        paymentType: {
            columns: {
                paymentType: f.valuesFromArray({
                    values: ['Credit Card', 'Debit Card', 'COD', 'Bank Transfer'],
                    isUnique: true,
                })
            },
            count: 4
        },
        shippingProvider: {
            columns: {
                shippingProvider: f.valuesFromArray({
                    values: ['DHL', 'Flash', 'JT', 'ThaiPost'],
                    isUnique: true,
                })
            },
            count: 4
        },
        platform: {
            columns: {
                platformName: f.valuesFromArray({
                    values: ['Lazada', 'Shopee', 'TikTok Shop'],
                    isUnique: true,
                })
            },
            count: 3
        },
        transactionItem: {
            count: 0
        }
    }))

    await db.insert(schema.transactionItem).values([
        { transactionId: 1, productId: 1, quantity: 2 },
        { transactionId: 1, productId: 2, quantity: 1 },
        { transactionId: 2, productId: 3, quantity: 1 },
        { transactionId: 2, productId: 4, quantity: 4 },
        { transactionId: 3, productId: 5, quantity: 2 },
        { transactionId: 3, productId: 6, quantity: 2 },
        { transactionId: 4, productId: 7, quantity: 1 },
    ])
    await resetIdentitySequences();

    console.log("Seeding completed.");
}

main();