import { Client } from "pg";

const client = new Client({
    user: 'jsmgeadm',
    host: 'jsmge-postgres-db',
    database: 'jsmge',
    password: 'jsmgeadmpass',
    port: 5432
});

export function get_client() {
    return client;
}