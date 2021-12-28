import Joi from 'joi';
import { Entry } from './Entry';

export type PostEntryRequestBody = Pick<Entry, 'amount' | 'label' | 'date'>;

export const postEntryRequestBodySchema = Joi.object<PostEntryRequestBody>({
	amount: Joi.number().required(),
	label: Joi.string().required(),
	date: Joi.number().required(),
});
