<script>
	import Fetch from '$lib/Fetch.svelte';
	import DefaultError from './DefaultError.svelte';
	import DefaultLoading from './DefaultLoading.svelte';
</script>

<Fetch
	base={''}
	headers={() => ({
		// Authorization: `Bearer ${localStorage.getItem('freshair:auth')}`
	})}
	onError={(err) => {
		console.error(err);
	}}
	defaultError={DefaultError}
	defaultLoading={DefaultLoading}
>
	<slot />
</Fetch>
