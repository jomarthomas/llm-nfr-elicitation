<script lang="ts">
	import Grade from '$components/Grade.svelte';

	const FR = {
		id: 'hjnsvk',
		functionalRequirement:
			'System shall request a deposit of Rs. 5000 upon entry of valid customer information and update it temporarily in the customer database.',
		identifiedNFRs: [
			{
				id: 'hareer',
				attribute: 'Functional Suitability',
				requirement:
					'Functional Correctness: The system must accurately update the customer database with the temporary deposit information for 99.9% of valid customer entries.',
				justification:
					'The FR requires the system to correctly process and update customer data, necessitating high accuracy.'
			},
			{
				id: 'haredr',
				attribute: 'Performance Efficiency',
				requirement:
					'Time Behavior: The system must process the deposit request and update the customer database in less than 500 milliseconds for up to 100 concurrent requests.',
				justification:
					'The FR involves real-time processing of financial transactions, requiring timely responses.'
			},
			{
				id: 'haseer',
				attribute: 'Security',
				requirement:
					'Integrity: The system must ensure that customer data and deposit information are handled in a way that prevents unauthorized modifications or tampering.',
				justification:
					'The FR involves sensitive financial data, requiring stringent integrity measures to prevent data corruption or manipulation.'
			}
		]
	};

	let nfrScores = $state(
		FR.identifiedNFRs.map((nfr) => ({
			id: nfr.id,
			attributeScore: 0, // Applicability score
			requirementScore: 0 // Validity score
		}))
	);

	// Handle form submission
	function handleSubmit(event: Event) {
		event.preventDefault();
		const payload = {
			id: FR.id,
			identifiedNFRs: nfrScores.map((score) => ({
				id: score.id,
				attribute: score.attributeScore,
				requirement: score.requirementScore
			}))
		};
		console.log('Payload:', payload); // Replace with your endpoint logic
		// Example: fetch('/api/submit', { method: 'POST', body: JSON.stringify(payload) });
	}
</script>

<form class="fr-evaluation" onsubmit={handleSubmit}>
	<h1 class="fr-evaluation__title">Functional Requirement</h1>
	<p class="fr-evaluation__description">{FR.functionalRequirement}</p>

	<div class="fr-evaluation__nfr-list">
		{#each FR.identifiedNFRs as nfr, index}
			<div class="nfr-item">
				<h2 class="nfr-item__title">NFR {index + 1}</h2>
				<div class="nfr-item__field">
					<span class="nfr-item__label">Attribute:</span>
					<span class="nfr-item__value">{nfr.attribute}</span>
				</div>
				<div class="nfr-item__field">
					<span class="nfr-item__label">Requirement:</span>
					<span class="nfr-item__value">{nfr.requirement}</span>
				</div>
				<div class="nfr-item__field">
					<span class="nfr-item__label">Justification:</span>
					<span class="nfr-item__value">{nfr.justification}</span>
				</div>

				<div class="nfr-item__scores">
					<div class="nfr-item__score">
						<span class="nfr-item__score-label">Category Applicability:</span>
						<Grade bind:level={nfrScores[index].attributeScore} />
					</div>
					<div class="nfr-item__score">
						<span class="nfr-item__score-label">Requirement Validity:</span>
						<Grade bind:level={nfrScores[index].requirementScore} />
					</div>
				</div>
			</div>
		{/each}
	</div>

	<button type="submit" class="CrispButton">Submit Evaluation</button>
</form>

<style lang="scss">
	/* BEM with SCSS */
	.fr-evaluation {
		@include box(100%, auto);
		margin: 0 auto;
		padding: 20px 0;

		&__title {
			font-size: 24px;
			margin-bottom: 10px;
		}

		&__description {
			font-size: 16px;
			color: var(--subFG);
			margin-bottom: 20px;
			line-height: 1.5;
		}

		&__nfr-list {
			display: flex;
			flex-direction: column;
			gap: 20px;
		}

		.CrispButton {
			margin-top: 20px;
			margin-left: auto;
		}
	}

	.nfr-item {
		background-color: #f9f9f9;
		padding: 15px;
		border-radius: 4px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

		&__title {
			font-size: 18px;
			color: #444;
			margin-bottom: 10px;
		}

		&__field {
			margin-bottom: 10px;
		}

		&__label {
			font-weight: bold;
			color: #555;
			margin-right: 5px;
		}

		&__value {
			color: #777;
			word-break: break-word;
		}

		&__scores {
			// @include box();
			@include make-flex($align: flex-start);
			margin-top: 25px;
		}

		&__score {
			display: flex;
			align-items: center;
			gap: 10px;
		}

		&__score-label {
			color: #555;
			font-size: 14px;
		}
	}
</style>
