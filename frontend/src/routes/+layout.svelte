<script lang="ts">
	import '../styles/root/reset.scss';
	import '../styles/root/global.scss';
	import { type Snippet } from 'svelte';
	import Header from '$components/Header.svelte';
	import Toast from '$components/Toast.svelte';
	import { addToast, ToastStore } from '$stores/ToastStore';

	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let { children }: { children: Snippet } = $props();

	onMount(() => {
		console
		if ($page.url.searchParams.get('error') !== null) {
			addToast({
				type: 'danger',
				message: $page.url.searchParams.get('error')!
			});

			goto($page.url.pathname, { replaceState: true });
		}
	});
</script>

<Header />
{@render children?.()}

{#if $ToastStore}
	{#each $ToastStore as toast (toast.id)}
		<Toast {...toast} />
	{/each}
{/if}
