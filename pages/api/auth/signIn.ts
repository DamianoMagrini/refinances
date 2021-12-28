import { scrypt } from 'crypto';
import type { NextApiHandler } from 'next';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { authUpRequestBodySchema } from '../../../models/AuthRequestBody';
import { ErrorResponse } from '../../../models/ErrorResponse';
import { SignInResponse } from '../../../models/SignInResponse';
import { SCRYPT_SALT } from '../../../utils/constants';
import { getDatabase } from '../../../utils/getDatabase';
import { getRedisClient } from '../../../utils/getRedisClient';
import { setCookie } from '../../../utils/setCookie';

const signInHandler: NextApiHandler<SignInResponse | ErrorResponse> = async (req, res) => {
	if (req.method !== 'POST')
		return res.status(400).send({ error: 'This endpoint only supports POST' });

	const requestBodyValidationResult = authUpRequestBodySchema.validate(req.body);
	if (requestBodyValidationResult.error)
		return res.status(400).send({ error: requestBodyValidationResult.error.message });

	const usersCollection = (await getDatabase()).collection('users');
	const user = await usersCollection.findOne({
		email: { $eq: requestBodyValidationResult.value.email },
	});

	if (!user) return res.status(404).json({ error: 'User not found' });

	const passwordHash: Buffer = (await promisify(scrypt)(
		requestBodyValidationResult.value.password,
		SCRYPT_SALT,
		32,
	)) as any;
	if (user.passwordHash.toString() !== passwordHash.toString())
		return res.status(401).json({ error: 'Wrong password' });

	const sessionToken = uuidv4();
	const redisClient = await getRedisClient();
	await redisClient.set(
		sessionToken,
		JSON.stringify({
			userId: user._id.toString(),
			expires: Date.now() + 86_400_000 * 7,
		}),
	);
	setCookie(res, 'session', sessionToken);

	return res.status(200).json({ ok: true });
};

export default signInHandler;
