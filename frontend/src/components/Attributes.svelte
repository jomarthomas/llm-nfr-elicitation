<script lang="ts">
	const allAttrs = {
		'': '',
		'Functional Suitability':
			'Capability of a product to provide functions that meet stated and implied needs of intended users when used under specified conditions.',
		'Performance Efficiency':
			'Capability of a product to perform functions within specified time and throughput parameters and be efficient in resource use.',
		Compatibility:
			'Capability of a product to exchange information with other products and perform functions while sharing environment and resources.',
		Usability:
			'Ensures ease of use and user experience. Includes learnability, operability, and user error protection.',
		Reliability:
			'Ensures the system remains operational over time. Includes fault tolerance, recoverability, and availability.',
		Security:
			'Ensures data protection and resistance to malicious actions. Includes confidentiality, integrity, authentication, and non-repudiation.',
		Maintainability:
			'Ensures the system can be efficiently modified and tested. Includes modularity, modifiability, and testability.',
		Flexibility:
			'Ensures the system can adapt to increased load or environmental changes. Includes adaptability and scalability.',
		Safety:
			'Ensures the system prevents harm to users, data, or the environment. Includes fail-safe mechanisms and risk identification.'
	};
	let {
		attr = $bindable()
	}: {
		attr: keyof typeof allAttrs;
	} = $props();
</script>

<div class="Attributes" data-needed>
	{#each ['Functional Suitability', 'Performance Efficiency', 'Compatibility', 'Usability', 'Reliability', 'Security', 'Maintainability', 'Flexibility', 'Safety'] as value}
		<label
			class="CrispButton"
			data-selected={value === attr}
			title={allAttrs[value as keyof typeof allAttrs]}
		>
			<input type="radio" bind:group={attr} {value} />
			{value}
		</label>
	{/each}
</div>

<style lang="scss">
	.Attributes {
		gap: 10px;
		position: relative;
		// @include make-flex($dir: row);
		display: grid;
		grid-template-rows: 1fr 1fr;
		grid-template-columns: 1fr 1fr 1fr;

		@include respondAt(666px) {
			grid-template-columns: 1fr 1fr;
		}

		@include respondAt(430px) {
			grid-template-columns: 1fr;
		}

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
			@include box(auto, 40px);
			border: 1px solid #ccc;
			border-radius: 5px;
			// margin: 5px;
			display: inline-block;
			@include make-flex();

			&[data-selected='true'] {
				&:hover {
					// background-color: aquamarine;
					background-color: #0969da;
					color: white;
				}
				color: white;
				background-color: #0969da;
			}

			input[type='radio'] {
				display: none;
			}
		}
	}
</style>
