"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const node_postgres_1 = require("drizzle-orm/node-postgres");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: ".env.local" });
const connectionString = process.env.DATABASE_URL;
exports.db = (0, node_postgres_1.drizzle)({
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: false,
    },
});
