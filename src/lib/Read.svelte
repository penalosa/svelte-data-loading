<script lang="ts">
	import type { Options } from './common';
	import { ctxSymbol, doFetch, DataError } from './common';
	import { getContext } from 'svelte';

	const options: SvelteStore<Options> = getContext(ctxSymbol);

	export let path: `/${string}`;
	let loading: boolean = true;
	let error: DataError;
	let data: object;

	$: path && loadData();
	const loadData = async () => {
		try {
			data = await doFetch($options, { path, method: 'GET' });
		} catch (e) {
			error = e;
			if ($options.onError !== null) {
				$options.onError(e);
			}
		}
		loading = false;
	};
	$options.rerender.subscribe((changed) => {
		console.log(changed);
		if (changed.path === path) {
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
	<slot {data} />
{:else if error}
	<slot name="error" {error}>
		{#if $options.defaultError !== null}
			<svelte:component this={$options.defaultError} {error} />
		{/if}
	</slot>
{/if}
