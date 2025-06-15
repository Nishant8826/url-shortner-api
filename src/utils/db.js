import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

export const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: { rejectUnauthorized: false }
    }
});

(async () => {
    try {

        await db.schema.hasTable('url_shortener').then(async (exists) => {
            if (!exists) {
                await db.schema.createTable('url_shortener', (table) => {
                    table.increments('id').primary();
                    table.string('original_url', 1000).notNullable();
                    table.string('short_code', 20).notNullable();
                    table.timestamp('created_at').defaultTo(db.fn.now());
                });
                console.log('url_shortener table successfully created');
            }
        });
        await db.schema.hasTable('url_access_logs').then(async (exists) => {
            if (!exists) {
                await db.schema.createTable('url_access_logs', (table) => {
                    table.increments('id').primary();
                    table.string('short_code', 10).notNullable();
                    table.specificType('ip', 'inet');
                    table.string('referrer', 100);
                    table.timestamp('accessed_at').defaultTo(db.fn.now());
                });
                console.log('url_access_logs table successfully created');
            }
        });
        console.log('DB connected successfully');
    } catch (err) {
        console.error('Unable to connect to the database!', err);
    }
})();

