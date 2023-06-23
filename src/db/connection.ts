const { Pool } = require('pg');
import config from "../config";

process.env.PGDATABASE = config.PGDATABASE;

if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}

module.exports = new Pool();
