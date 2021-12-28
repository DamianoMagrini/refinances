import { scrypt } from 'crypto';
import { ObjectId } from 'mongodb';
import type { NextApiHandler } from 'next';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { authUpRequestBodySchema } from '../../../models/AuthRequestBody';
import { ErrorResponse } from '../../../models/ErrorResponse';
import { SignUpResponse } from '../../../models/SignUpResponse';
import { SCRYPT_SALT } from '../../../utils/constants';
import { getDatabase } from '../../../utils/getDatabase';
import { getRedisClient } from '../../../utils/getRedisClient';
import { setCookie } from '../../../utils/setCookie';

const signUpHandler: NextApiHandler<SignUpResponse | ErrorResponse> = async (req, res) => {
	if (req.method !== 'POST')
		return res.status(400).send({ error: 'This endpoint only supports POST' });

	const requestBodyValidationResult = authUpRequestBodySchema.validate(req.body);
	if (requestBodyValidationResult.error)
		return res.status(400).send({ error: requestBodyValidationResult.error.message });

	const usersCollection = (await getDatabase()).collection('users');
	const existingUser = await usersCollection.findOne({
		email: { $eq: requestBodyValidationResult.value.email },
	});
	if (existingUser) return res.status(400).send({ error: 'A user with that email already exists' });

	const passwordHash: Buffer = (await promisify(scrypt)(
		requestBodyValidationResult.value.password,
		SCRYPT_SALT,
		32,
	)) as any;
	const newUser = await usersCollection.insertOne({
		_id: new ObjectId(),
		email: requestBodyValidationResult.value.email,
		passwordHash,
	});

	const sessionToken = uuidv4();
	const redisClient = await getRedisClient();
	await redisClient.set(
		sessionToken,
		JSON.stringify({
			userId: newUser.insertedId.toString(),
			expires: Date.now() + 86_400_000 * 7,
		}),
	);
	setCookie(res, 'session', sessionToken);

	return res.status(200).json({ ok: true });
};

export default signUpHandler;
