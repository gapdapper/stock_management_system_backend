import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: 'postgresql://admin:password@localhost:5432/stock_management_db',
  },
  casing: "snake_case",
});