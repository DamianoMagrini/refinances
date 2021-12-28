import { CookieSerializeOptions, serialize } from 'cookie';
import { NextApiResponse } from 'next';

export const setCookie = (
	res: NextApiResponse,
	name: string,
	value: string,
	options: CookieSerializeOptions = { path: '/' },
) => {
	if ('maxAge' in options) {
		options.expires = new Date(Date.now() + options.maxAge!);
		options.maxAge! /= 1000;
	}

	res.setHeader('Set-Cookie', serialize(name, value, options));
};
