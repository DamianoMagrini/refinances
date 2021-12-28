module.exports = {
	content: ['./pages/**/*.tsx', './components/**/*.tsx'],
	theme: {
		fontFamily: {
			sans: ['Inter', 'sans-serif'],
		},
		extend: {},
	},
	plugins: [require('@tailwindcss/forms')],
};
