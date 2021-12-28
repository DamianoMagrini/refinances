import { createClient } from 'redis';
import { REDIS_URI } from './constants';

const client = createClient({ url: REDIS_URI });
client.on('error', (err) => console.error('Redis Client Error', err));

let isConnected = false;

export const getRedisClient = async () => {
	if (isConnected) return client;

	await client.connect();
	isConnected = true;

	return client;
};
