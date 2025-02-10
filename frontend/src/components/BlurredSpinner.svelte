<script lang="ts">
	import Spinner from './Spinner.svelte';

	let {
		style
	}: {
		style?: string;
	} = $props();
</script>

<div class="BlurredSpinnerWrapper" {style}>
	<Spinner />
</div>

<style lang="scss">
	.BlurredSpinnerWrapper {
		top: 0;
		left: 0;
		z-index: 15;
		@include box();
		position: absolute;
		@include make-flex();
    border-radius: 19px;
		background: #b4b4b424;
		backdrop-filter: blur(5px);
	}
</style>
