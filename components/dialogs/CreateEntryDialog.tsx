import { Dialog } from '@headlessui/react';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Entry } from '../../models/Entry';

export interface CreateEntryDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (entry: Omit<Entry, 'owner'>) => void;
}

export const CreateEntryDialog: React.FC<CreateEntryDialogProps> = ({
	isOpen,
	onClose,
	onSave,
}) => {
	const { register, handleSubmit, reset } = useForm<Omit<Entry, 'owner'>>();

	useEffect(() => {
		reset();
	}, [isOpen, reset]);

	const onSubmit: SubmitHandler<Omit<Entry, 'owner'>> = (data) => {
		onSave({
			label: data.label,
			amount: Number(data.amount),
			date: new Date(data.date).getTime(),
		});
	};

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			className={'fixed z-10 inset-0 flex justify-center items-center'}>
			<Dialog.Overlay className={'fixed inset-0 bg-gray-50 bg-opacity-70'} />

			<div className='bg-white p-5 rounded-lg border border-gray-100 w-96 z-10'>
				<Dialog.Title className='text-xl font-semibold'>Edit entry</Dialog.Title>
				<Dialog.Description className='mt-1'>Edit entry details</Dialog.Description>

				<form onSubmit={handleSubmit(onSubmit)}>
					<label className='block mt-3'>
						<p className='text-sm text-gray-500 tracking-wide'>Label</p>
						<input
							type='text'
							defaultValue=''
							{...register('label')}
							className='mt-1 rounded-md w-full border-gray-100 focus:ring focus:ring-indigo-200 focus:border-indigo-500'
						/>
					</label>

					<label className='block mt-3'>
						<p className='text-sm text-gray-500 tracking-wide'>Amount (positive or negative)</p>
						<input
							type='number'
							step={0.01}
							defaultValue={0}
							{...register('amount')}
							className='mt-1 rounded-md w-full border-gray-100 focus:ring focus:ring-indigo-200 focus:border-indigo-500'
						/>
					</label>

					<label className='block mt-3'>
						<p className='text-sm text-gray-500 tracking-wide'>Date</p>
						<input
							type='date'
							defaultValue={new Date().toISOString().split('T')[0]}
							{...register('date')}
							className='mt-1 rounded-md w-full border-gray-100 focus:ring focus:ring-indigo-200 focus:border-indigo-500'
						/>
					</label>

					<input
						type='submit'
						value='Create entry'
						className='text-center px-3 cursor-pointer bg-indigo-500 text-white font-semibold py-2 rounded-md mt-3 w-full hover:bg-indigo-600 focus:ring focus:ring-indigo-200 outline-none'
					/>
				</form>
				<button
					onClick={onClose}
					className='text-center px-3 text-indigo-500 bg-white font-semibold py-2 rounded-md mt-2 w-full hover:bg-indigo-50 focus:ring focus:ring-indigo-200 outline-none'>
					Cancel
				</button>
			</div>
		</Dialog>
	);
};
