import { Entry } from './Entry';

export interface PostEntryResponse {
	ok: boolean;
}

export interface GetEntriesReponse {
	entries: (Entry & { _id: string })[];
}

export interface PutEntryResponse {
	ok: boolean;
}

export interface DeleteEntryResponse {
	ok: boolean;
}

export type EntriesResponse =
	| PostEntryResponse
	| GetEntriesReponse
	| UpdateEntryResponse
	| DeleteEntryResponse;
