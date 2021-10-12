<script lang="ts">
	import type { Options } from './common';
	import { ctxSymbol, doFetch, DataError } from './common';
	import { getContext, onDestroy } from 'svelte';
	import { isFunction, throttle } from 'lodash-es';
	import { Writable, writable } from 'svelte/store';
	import { v4 as uuid } from '@lukeed/uuid';

	const options: SvelteStore<Options> = getContext(ctxSymbol);

	export let path: `/${string}`;
	let loading: boolean = true;
	let error: DataError;
	let data: Writable<object>;
	let updating = false;
	let unsubscribe;
	const componentInstance = uuid();

	const update = throttle(async (data) => {
		try {
			data = await doFetch($options, { path, method: 'PUT', body: data });
			$options.rerender.set({ path, source: componentInstance });
		} catch (e) {
			error = e;
			if ($options.onError !== null) {
				$options.onError(e);
			}
		}
		updating = false;
		loading = false;
	}, 3000);
	$: path && loadData();
	const loadData = async () => {
		try {
			data = writable(await doFetch($options, { path, method: 'GET' }));
			let skipInitial = true; // Skip the initial subscription as data will not have changed
			unsubscribe = data.subscribe((changed) => {
				if (!skipInitial) {
					updating = true;
					update(changed);
				}
				skipInitial = false;
			});
		} catch (e) {
			error = e;
			if ($options.onError !== null) {
				$options.onError(e);
			}
		}
		loading = false;
	};

	onDestroy(async () => {
		(update as any).flush();
		isFunction(unsubscribe) && unsubscribe();
	});
	$options.rerender.subscribe((changed) => {
		if (changed.path === path && changed.source !== componentInstance) {
			(update as any).cancel();
			isFunction(unsubscribe) && unsubscribe();
			loading = true;
			loadData();
		}
	});
</script>

{#if loading}
	<slot name="loading">
		{#if $options.defaultLoading !== null}
			<svelte:component this={$options.defaultLoading} />
		{/if}
	</slot>
{:else if !loading && !error && data}
	<slot {data} {updating} />
{:else if error}
	<slot name="error" {error}>
		{#if $options.defaultError !== null}
			<svelte:component this={$options.defaultError} {error} />
		{/if}
	</slot>
{/if}
