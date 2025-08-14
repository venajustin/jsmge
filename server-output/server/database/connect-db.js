import { Client } from "pg";

const client = new Client({
    user: process.env.ADMIN_USER_NAME,
    host: 'jsmge-postgres-db',
    database: 'jsmge',
    password: process.env.ADMIN_USER_PASSWORD,
    port: 5432
});

export function get_client() {
    return client;
}