import type { AppProps } from 'next/app';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Component {...pageProps} />
			<Toaster />
		</>
	);
}

export default MyApp;
