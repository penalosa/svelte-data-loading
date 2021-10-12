<script lang="ts">
	import type { Options, ComponentOptions } from './common';
	import { ctxSymbol, doFetch, DataError } from './common';
	import { getContext } from 'svelte';

	const options: SvelteStore<Options> = getContext(ctxSymbol);

	export let path: `/${string}`;
	export let onFinish: ((data: any) => void) | null = null;
	let loading: boolean = false;
	let error: DataError;

	const trigger = async ({ headers }: Pick<ComponentOptions, 'headers'> = {}) => {
		loading = true;
		try {
			const data = await doFetch($options, {
				path,
				method: 'DELETE',
				headers
			});
			if (onFinish !== null) {
				onFinish(data);
				$options.rerender.set({ path });
			}
		} catch (e) {
			error = e;
			if ($options.onError !== null) {
				$options.onError(e);
			}
		}
		loading = false;
	};
</script>

{#if loading}
	<slot name="loading">
		{#if $options.defaultLoading !== null}
			<svelte:component this={$options.defaultLoading} />
		{/if}
	</slot>
{:else if !loading && !error}
	<slot {trigger} />
{:else if error}
	<slot name="error" {error}>
		{#if $options.defaultError !== null}
			<svelte:component this={$options.defaultError} {error} />
		{/if}
	</slot>
{/if}
