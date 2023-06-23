"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Pool } = require('pg');
const config_1 = __importDefault(require("../config"));
process.env.PGDATABASE = config_1.default.PGDATABASE;
if (!process.env.PGDATABASE) {
    throw new Error('PGDATABASE not set');
}
module.exports = new Pool();
