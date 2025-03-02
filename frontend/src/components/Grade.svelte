<script lang="ts">
	let {
		level = $bindable(),
		type
	}: {
		level: Number;
		type: 'NFR' | 'Attribute';
	} = $props();

	const nfrMessage = {
		1: 'Invalid: Incoherent, irrelevant, or contradictory.',
		2: 'Barely Valid: Major flaws, partially relevant.',
		3: 'Partially Valid: Somewhat clear, noticeable issues.',
		4: 'Mostly Valid: Clear and relevant, minor flaws.',
		5: 'Fully Valid: Specific, achievable, perfectly justified.'
	};
	const attrMessage = {
		1: 'Not Applicable: Completely unsuitable and unrelated.',
		2: 'Barely Applicable: Minimal or tangential relevance.',
		3: 'Somewhat Applicable: Moderately relevant, but questionable.',
		4: 'Mostly Applicable: Strong fit with minor doubts.',
		5: 'Perfectly Applicable: Exact and ideal match.'
	};

	let selectedMessages: { [key: number]: string } = $state(
		type === 'Attribute' ? attrMessage : nfrMessage
	);
</script>

<div class="Grade" data-needed>
	{#each [1, 2, 3, 4, 5] as value}
		<label class="CrispButton" data-selected={value === level} title={selectedMessages[value]}>
			<input type="radio" bind:group={level} {value} />
			{value}
		</label>
	{/each}
</div>

<style lang="scss">
	.Grade {
		gap: 10px;
		position: relative;
		@include make-flex($dir: row);

		&[data-needed] {
			&:after {
				position: absolute;
				content: ' *';
				color: red;
				right: -13px;
				top: -10px;
			}
		}
		.CrispButton {
			cursor: pointer;
			padding: 15px;
			@include box(40px, 40px);
			border: 1px solid #ccc;
			border-radius: 5px;
			// margin: 5px;
			display: inline-block;
			@include make-flex();

			&[data-selected='true'] {
				&:hover {
					background-color: #0969da;
					color: white;
				}
				background-color: #0969da;
				color: white;
			}

			input[type='radio'] {
				display: none;
			}
		}
	}
</style>
