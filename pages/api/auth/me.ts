import type { NextApiHandler } from 'next';
import { ErrorResponse } from '../../../models/ErrorResponse';
import { MeResponse } from '../../../models/MeResponse';
import { getUserId } from '../../../utils/getUserId';

const meHandler: NextApiHandler<MeResponse | ErrorResponse> = async (req, res) => {
	if (req.method !== 'GET')
		return res.status(400).send({ error: 'This endpoint only supports GET' });

	return res.status(200).json({ me: await getUserId(req) });
};

export default meHandler;
