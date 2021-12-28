import { FieldError } from 'react-hook-form';

export const parseError = (fieldName: string, error: FieldError): string => {
	switch (error.type) {
		case 'min':
		case 'string.min':
			return `${fieldName} too short`;

		case 'string.email':
			return "This doesn't look to be a valid email";

		case 'required':
		case 'string.empty':
			return `${fieldName} is required`;

		default:
			return 'Error!';
	}
};
