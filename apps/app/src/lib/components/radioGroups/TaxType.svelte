<script lang="ts">
	export let type = 'Tax';
	const options = [
		{ value: 'Tax', label: 'Tax' },
		{ value: 'VAT', label: 'VAT' }
	];
	import Radio from './Radio.svelte';
</script>

<Radio bind:selected={type} {options} />
