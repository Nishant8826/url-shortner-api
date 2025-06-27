import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

export const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'url_shortener' ,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'admin',
        ssl: false 
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
        await db.schema.hasTable('applicationusers').then(async (exists) => {
            if (!exists) {
                await db.schema.createTable('applicationusers', (table) => {
                        table.increments('userId').primary(); 
                        table.string('firebase_uid'); 
                        table.string('email').notNullable().unique();
                        table.string('display_name');
                        table.string('password').notNullable();
                        table.string('photo_url');
                        table.jsonb('provider_info'); 
                        table.timestamp('created_at').defaultTo(db.fn.now());

                });
                console.log('applicationusers table successfully created');
            }
        });
        console.log('DB connected successfully');
    } catch (err) {
        console.error('Unable to connect to the database!', err);
    }
})();

