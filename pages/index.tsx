import { AxiosError } from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CreateEntryDialog } from '../components/dialogs/CreateEntryDialog';
import { EditEntryDialog } from '../components/dialogs/EditEntryDialog';
import { withAuthGuard } from '../components/guards/AuthGuard';
import {
	DeleteEntryResponse,
	GetEntriesReponse,
	PostEntryResponse,
	PutEntryResponse,
} from '../models/EntriesResponse';
import { Entry } from '../models/Entry';
import { PutEntryRequestBody } from '../models/PutEntryRequestBody';
import { api } from '../utils/api';

export interface EntryViewProps {
	entry: Entry & { _id: string };
	onUpdate: () => void;
}

export const EntryView: React.FC<EntryViewProps> = ({ entry, onUpdate }) => {
	const [isEditDialogOpen, setEditDialogOpen] = useState(false);

	return (
		<tr className='hover:bg-indigo-50'>
			<EditEntryDialog
				entry={entry}
				isOpen={isEditDialogOpen}
				onClose={() => setEditDialogOpen(false)}
				onSave={(data) => {
					setEditDialogOpen(false);
					api
						.put<PutEntryResponse>('/entries', { _id: entry._id, ...data } as PutEntryRequestBody)
						.then(({ data }) => {
							onUpdate();
						})
						.catch((error: AxiosError) => toast.error(error.response?.data?.error));
				}}
			/>
			<td className='px-3 py-2'>{entry.label}</td>
			<td className='px-3 py-2'>
				{new Date(entry.date).toLocaleDateString('en', { dateStyle: 'medium' })}
			</td>
			<td
				className={`tabular-nums px-3 py-2 text-right ${
					entry.amount >= 0 ? 'text-green-500' : 'text-red-500'
				}`}>
				${entry.amount.toFixed(2).replace('-', '–')}
			</td>
			<td className='px-3 py-2 whitespace-nowrap'>
				<button
					className='p-1 m-1'
					onClick={() => {
						setEditDialogOpen(true);
					}}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-6 w-6'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
						/>
					</svg>
				</button>
				<button
					className='p-1 m-1'
					onClick={() => {
						api
							.delete<DeleteEntryResponse>(`/entries?_id=${entry._id}`)
							.then(({ data }) => {
								onUpdate();
							})
							.catch((error: AxiosError) => toast.error(error.response?.data?.error));
					}}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-6 w-6'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M6 18L18 6M6 6l12 12'
						/>
					</svg>
				</button>
			</td>
		</tr>
	);
};

const HomePage: NextPage = () => {
	const router = useRouter();
	const [entries, setEntries] = useState<(Entry & { _id: string })[]>([]);
	const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

	const fetchEntries = () => {
		api
			.get<GetEntriesReponse>('/entries')
			.then(({ data }) => setEntries(data.entries))
			.catch((error: AxiosError) => toast.error(error.response?.data?.error));
	};

	useEffect(() => {
		fetchEntries();
	}, []);

	return (
		<div className='h-screen bg-gray-50 overflow-auto text-center'>
			<Head>
				<title>Refinances</title>
				<meta
					name='description'
					content='A simple Next.js + MongoDB + Redis app to manage your finances'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className='w-full max-w-3xl mx-auto text-left my-8 px-3'>
				<div className='flex justify-between items-end gap-2 mb-4'>
					<h1 className='text-2xl font-semibold'>Refinances</h1>
					<div>
						<button onClick={fetchEntries} className='p-1 m-1'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
								/>
							</svg>
						</button>
						<button onClick={() => setCreateDialogOpen(true)} className='p-1 m-1'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 4v16m8-8H4'
								/>
							</svg>
						</button>
						<button
							onClick={() => {
								document.cookie = 'session=';
								router.replace('/auth/signIn');
							}}
							className='p-1 m-1'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
								/>
							</svg>
						</button>
					</div>
				</div>

				<CreateEntryDialog
					isOpen={isCreateDialogOpen}
					onClose={() => setCreateDialogOpen(false)}
					onSave={(data) => {
						api
							.post<PostEntryResponse>('/entries', data)
							.then(({ data }) => {
								fetchEntries();
								setCreateDialogOpen(false);
							})
							.catch((error: AxiosError) => toast.error(error.response?.data?.error));
					}}
				/>

				<div className='border border-gray-100 rounded-lg overflow-hidden'>
					<table className='bg-white w-full'>
						<thead>
							<tr>
								<th className='py-2 px-3 text-left'>Label</th>
								<th className='py-2 px-3 text-left'>Date</th>
								<th className='py-2 px-3 text-left'>Amount</th>
								<th className='py-2 px-3 text-left'>Actions</th>
							</tr>
						</thead>
						<tbody>
							{entries.map((entry) => (
								<EntryView entry={entry} onUpdate={fetchEntries} key={entry._id} />
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default withAuthGuard(HomePage);
