import { NextApiRequest } from 'next';
import { getRedisClient } from './getRedisClient';

export const getUserId = async (req: NextApiRequest): Promise<string | null> => {
	if (!req.cookies.session) return null;
	const redisClient = await getRedisClient();

	const sessionString = await redisClient.get(req.cookies.session);
	if (!sessionString) return null;

	const session = JSON.parse(sessionString);

	if (session?.expires < Date.now()) {
		await redisClient.del(req.cookies.session);
		return null;
	}

	await redisClient.set(
		req.cookies.session,
		JSON.stringify({
			userId: session.userId,
			expires: Date.now() + 86_400_000 * 7,
		}),
	);

	return session.userId;
};
