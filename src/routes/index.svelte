<script>
	import Read from '$lib/Read.svelte';
	import Create from '$lib/Create.svelte';
	import Update from '$lib/Update.svelte';
	import Field from './Field.svelte';
	import Delete from '$lib/Delete.svelte';
	let bg = 'red';
</script>

<h1 style="color: {bg}">Welcome to SvelteKit</h1>
<p>
	Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation about
	<code
		><Read path="/bar.json" let:data
			>{data.name}
			<span slot="loading">Loading...</span>
		</Read></code
	>
	<Create
		path="/foo.json"
		onFinish={(d) => {
			bg = d.color;
			setTimeout(() => (bg = 'red'), 500);
		}}
		let:trigger
	>
		<button on:click={() => trigger({ body: {} })}>Trigger</button>
		<span slot="loading">Loading...</span>
	</Create>
	<Update path="/bar.json" let:data let:updating>
		<span slot="loading">Loading...</span>

		<Field {data} />
		{#if updating}
			<span>Updating...</span>
		{/if}
	</Update>

	<Delete
		path="/bar.json"
		onFinish={(d) => {
			console.log;
		}}
		let:trigger
	>
		<button on:click={() => trigger()}>Clear</button>
		<span slot="loading">Loading...</span>
	</Delete>
</p>
