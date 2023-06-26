import { Pool } from 'pg';
import dotenv from 'dotenv';

const ENV = process.env.NODE_ENV || "development"
const path = `${__dirname}/../../config/.env.${ENV}`

dotenv.config({ path });
process.env.PGDATABASE = process.env.PGDATABASE;

if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}

const pool = new Pool();

export default pool;
