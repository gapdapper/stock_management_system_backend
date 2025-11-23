import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import dotenv from 'dotenv';
import * as schema from './schema';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool, { schema });

export default db;