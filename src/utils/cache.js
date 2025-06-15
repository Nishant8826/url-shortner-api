import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

export const client = createClient({
    password: process.env.REDIS_PASSWORD || 'E0zV4hX9LcTUTSdQHgZXTWaJBL2hYsoW',
    socket: {
        host: process.env.REDIS_HOST || 'redis-10565.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: process.env.REDIS_PORT || 10565
    }
});

client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
    await client.connect();
    console.log('Redis connected successfully');
})();
