import { Pool } from 'pg';
import config from '../config';

process.env.PGDATABASE = config.PGDATABASE;

if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}

const pool = new Pool();

export default pool;
