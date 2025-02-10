<script lang="ts">
	import '../styles/root/reset.scss';
	import '../styles/root/global.scss';
	import { type Snippet } from 'svelte';
	import Header from '$components/Header.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<Header />
{@render children?.()}
