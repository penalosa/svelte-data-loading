import type { SvelteComponent } from 'svelte';
import { isObject } from 'lodash-es';
import type { Writable } from 'svelte/store';
export interface ReRender {
	source?: string;
	path: string;
}
export interface Options {
	base: string;
	headers: AdditionalHeaders | null;
	transform: TransformRequest | null;
	defaultLoading: typeof SvelteComponent | null;
	defaultError: typeof SvelteComponent | null;
	onError: ((err: DataError) => void) | null;
	rerender: Writable<ReRender>;
}
interface FetchOptions extends RequestInit {
	url: string;
}
export type AdditionalHeaders = () => HeadersInit;
export type TransformRequest = ({ method, url, headers, body }: FetchOptions) => FetchOptions;
export const Headers = Symbol.for('headers');
export class DataError extends Error {
	constructor(public response: Response, public data?: any) {
		super(response.statusText);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, DataError);
		}

		this.name = 'DataError';
		this.response = response;
		this.data = data;
	}
}
export const ctxSymbol = Symbol.for('svelte-data-loading:options');

export interface ComponentOptions {
	method: string;
	path: `/${string}`;
	headers?: HeadersInit;
	body?: any;
}

export const doFetch = async (options: Options, instance: ComponentOptions) => {
	try {
		let headers: HeadersInit = { 'Content-Type': 'application/json' };
		if (options.headers !== null) {
			headers = { ...headers, ...options.headers() };
		}

		let fetchOptions: FetchOptions = {
			url: `${options.base}${instance.path}`,
			method: instance.method,
			headers,
			body: instance.body,
			credentials: 'include'
		};

		if (options.transform !== null) {
			fetchOptions = options.transform(fetchOptions);
		}
		if (isObject(fetchOptions.body)) {
			fetchOptions.body = JSON.stringify(fetchOptions.body);
		}
		const res = await fetch(fetchOptions.url, fetchOptions);
		if (res.ok) {
			let data = await res.json();
			data[Headers] = res.headers;
			return data;
		} else {
			try {
				const data = await res.json();
				throw new DataError(res, data);
			} catch (e) {
				throw new DataError(res);
			}
		}
	} catch (e) {
		throw new DataError(e);
	}
};
