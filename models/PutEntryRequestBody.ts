import Joi from 'joi';
import { Entry } from './Entry';

export type PutEntryRequestBody = Partial<Pick<Entry, 'amount' | 'label' | 'date'>> & {
	_id: string;
};

export const putEntryRequestBodySchema = Joi.object<PutEntryRequestBody>({
	_id: Joi.string().length(24).required(),
	amount: Joi.number(),
	label: Joi.string(),
	date: Joi.number(),
});
