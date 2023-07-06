import { Pool } from 'pg';
import dotenv from 'dotenv';

const ENV = process.env.NODE_ENV || 'development';
const path = `${__dirname}/../../config/.env.${ENV}`;

dotenv.config({ path });

if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}
const config =
  ENV === 'production'
    ? {
        connectionString: process.env.PGDATABASE,
        ssl: {
          rejectUnauthorized: false
        }
      }
    : {};
const pool = new Pool(config);

export default pool;
