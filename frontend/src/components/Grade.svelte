<script lang="ts">
	let { level = $bindable() }: { level: Number } = $props();
</script>

<div class="Grade">
	{#each [1, 2, 3, 4, 5] as value}
		<label class="CrispButton" data-selected={value === level}>
			<input type="radio" bind:group={level} {value} />
			{value}
		</label>
	{/each}
</div>

<style lang="scss">
	.Grade {
		@include make-flex($dir: row);
		.CrispButton {
			cursor: pointer;
			padding: 15px;
			@include box(40px, 40px);
			border: 1px solid #ccc;
			border-radius: 5px;
			margin: 5px;
			display: inline-block;
			@include make-flex();

			&[data-selected='true'] {
				&:hover {
					background-color: aquamarine;
				}
				background-color: aquamarine;
			}

			input[type='radio'] {
				display: none;
			}
		}
	}
</style>
