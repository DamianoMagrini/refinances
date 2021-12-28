import Joi from 'joi';

export interface AuthRequestBody {
	email: string;
	password: string;
}

export const authUpRequestBodySchema = Joi.object<AuthRequestBody>({
	email: Joi.string().email({ tlds: false }).required(),
	password: Joi.string().min(8).required(),
});
