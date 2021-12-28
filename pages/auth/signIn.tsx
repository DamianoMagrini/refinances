import { joiResolver } from '@hookform/resolvers/joi';
import { AxiosError } from 'axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AuthRequestBody, authUpRequestBodySchema } from '../../models/AuthRequestBody';
import { SignInResponse } from '../../models/SignInResponse';
import { api } from '../../utils/api';
import { parseError } from '../../utils/parseError';

const SignInPage: NextPage = () => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AuthRequestBody>({ resolver: joiResolver(authUpRequestBodySchema) });

	const onSubmit: SubmitHandler<AuthRequestBody> = async (data) => {
		api
			.post<SignInResponse>('/auth/signIn', data)
			.then(({ data }) => {
				if (data.ok) router.replace('/');
			})
			.catch((error: AxiosError) => toast.error(error.response?.data?.error));
	};

	return (
		<div className='bg-gray-50 h-screen flex justify-center items-center'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='bg-white p-5 rounded-lg border border-gray-100 w-96'>
				<h1 className='text-xl font-semibold'>Sign in to your account</h1>

				<label className='block mt-3'>
					<p className='text-sm text-gray-500 tracking-wide'>Email</p>
					<input
						type='email'
						{...register('email', { required: true })}
						className='mt-1 rounded-md w-full border-gray-100 focus:ring focus:ring-indigo-200 focus:border-indigo-500'
					/>
					{errors.email && (
						<p className='text-sm mt-1 text-red-500'>{parseError('Email', errors.email)}</p>
					)}
				</label>

				<label className='block mt-3'>
					<p className='text-sm text-gray-500 tracking-wide'>Password</p>
					<input
						type='password'
						{...register('password', { required: true })}
						className='mt-1 rounded-md w-full border-gray-100 focus:ring focus:ring-indigo-200 focus:border-indigo-500'
					/>
					{errors.password && (
						<p className='text-sm mt-1 text-red-500'>{parseError('Password', errors.password)}</p>
					)}
				</label>

				<input
					type='submit'
					value='Sign in'
					className='text-center px-3 bg-indigo-500 text-white font-semibold py-2 rounded-md mt-3 w-full hover:bg-indigo-600 focus:ring focus:ring-indigo-200 outline-none'
				/>
			</form>
		</div>
	);
};

export default SignInPage;
