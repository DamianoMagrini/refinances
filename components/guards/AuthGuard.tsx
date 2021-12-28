import { AxiosError } from 'axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MeResponse } from '../../models/MeResponse';
import { api } from '../../utils/api';

const enum AuthStatus {
	Loading,
	SignedIn,
	SignedOut,
}

export const AuthGuard: React.FC = ({ children }) => {
	const router = useRouter();
	const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.Loading);

	useEffect(() => {
		api
			.get<MeResponse>('/auth/me')
			.then(({ data }) => {
				if (data.me === null) setAuthStatus(AuthStatus.SignedOut);
				else setAuthStatus(AuthStatus.SignedIn);
			})
			.catch((error: AxiosError) => toast.error(error.response?.data?.error));
	});

	if (authStatus === AuthStatus.Loading)
		return (
			<div className='h-screen flex justify-center items-center bg-gray-50'>
				<p className='text-sm text-gray-500'>Loading...</p>
			</div>
		);
	else if (authStatus === AuthStatus.SignedIn) return <>{children}</>;
	else {
		router.replace('/auth/signIn');
		return null;
	}
};

export const withAuthGuard = (Page: NextPage): NextPage =>
	function GuardedComponent() {
		return (
			<AuthGuard>
				<Page />
			</AuthGuard>
		);
	};
