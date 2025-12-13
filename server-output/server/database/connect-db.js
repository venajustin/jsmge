import { Client } from "pg";

const db_hostname = process.env.IS_DOCKER_CONTAINER ? 'jsmge-postgres-db-1' : 'localhost';
const db_port = process.env.IS_DOCKER_CONTAINER ? 5432 : 54646;

let client = undefined;


export function get_client() {
    if (client === undefined) {
        client = new Client({
            user: process.env.ADMIN_USER_NAME,
            host: db_hostname,
            database: 'jsmge',
            password: process.env.ADMIN_USER_PASSWORD,
            port: db_port
        });
    }
    return client;
}
