import { Db, MongoClient } from 'mongodb';
import { MONGODB_AUTH, MONGODB_DB_NAME, MONGODB_URI } from './constants';

let client: MongoClient | null = null;

export const getDatabase = async (): Promise<Db> => {
	if (client) return client.db(MONGODB_DB_NAME);

	// Connect to the database
	client = await MongoClient.connect(MONGODB_URI, { auth: MONGODB_AUTH });

	const db = client.db(MONGODB_DB_NAME);
	try {
		await db.createCollection('users');
		await db.createCollection('entries');
	} catch {
		console.info('Database collections already initialized');
	}

	return db;
};
