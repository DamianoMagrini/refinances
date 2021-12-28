import { ObjectId, WithId } from 'mongodb';
import type { NextApiHandler } from 'next';
import { EntriesResponse } from '../../models/EntriesResponse';
import { Entry } from '../../models/Entry';
import { ErrorResponse } from '../../models/ErrorResponse';
import { postEntryRequestBodySchema } from '../../models/PostEntryRequestBody';
import { putEntryRequestBodySchema } from '../../models/PutEntryRequestBody';
import { getDatabase } from '../../utils/getDatabase';
import { getUserId } from '../../utils/getUserId';

const entriesHandler: NextApiHandler<EntriesResponse | ErrorResponse> = async (req, res) => {
	const userId = await getUserId(req);
	if (userId === null) return res.status(401).json({ error: 'Unauthorized' });

	const entriesCollection = (await getDatabase()).collection<Entry>('entries');
	switch (req.method) {
		case 'POST': {
			const requestBodyValidationResult = postEntryRequestBodySchema.validate(req.body);
			if (requestBodyValidationResult.error)
				return res.status(400).send({ error: requestBodyValidationResult.error.message });

			const newEntry: WithId<Entry> = {
				_id: new ObjectId(),
				owner: userId,
				...requestBodyValidationResult.value,
			};
			await entriesCollection.insertOne(newEntry);

			return res.status(200).json({ ok: true });
		}

		case 'GET': {
			const entries = await entriesCollection.find({ owner: { $eq: userId } }).toArray();
			return res.status(200).json({ entries });
		}

		case 'PUT': {
			const requestBodyValidationResult = putEntryRequestBodySchema.validate(req.body);
			if (requestBodyValidationResult.error)
				return res.status(400).send({ error: requestBodyValidationResult.error.message });

			const entry = await entriesCollection.findOne({
				_id: { $eq: new ObjectId(requestBodyValidationResult.value._id) },
			});
			if (!entry) return res.status(404).json({ error: 'Not found' });
			if (entry.owner !== userId)
				return res.status(401).json({ error: 'You can only update your own entries' });

			await entriesCollection.updateOne(
				{ _id: { $eq: new ObjectId(requestBodyValidationResult.value._id) } },
				{
					$set: {
						...(requestBodyValidationResult.value.amount === undefined
							? {}
							: { amount: requestBodyValidationResult.value.amount }),
						...(requestBodyValidationResult.value.label === undefined
							? {}
							: { label: requestBodyValidationResult.value.label }),
						...(requestBodyValidationResult.value.date === undefined
							? {}
							: { date: requestBodyValidationResult.value.date }),
					},
				},
			);

			return res.status(200).json({ ok: true });
		}

		case 'DELETE': {
			const { _id } = req.query;
			if (typeof _id !== 'string')
				return res.status(400).json({ error: '`id` is a required parameter' });

			const entry = await entriesCollection.findOne({
				_id: { $eq: new ObjectId(_id) },
			});
			if (!entry) return res.status(404).json({ error: 'Not found' });
			if (entry.owner !== userId)
				return res.status(401).json({ error: 'You can only delete your own entries' });

			await entriesCollection.deleteOne({
				_id: { $eq: new ObjectId(_id) },
			});

			return res.status(200).json({ ok: true });
		}

		default:
			return res.status(405).json({ error: 'Method not supported' });
	}
};

export default entriesHandler;
