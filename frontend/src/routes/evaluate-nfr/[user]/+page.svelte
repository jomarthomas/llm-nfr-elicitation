<script lang="ts">
	import Grade from '$components/Grade.svelte';
	import { addToast } from '$stores/ToastStore';
	import { page } from '$app/state';

	// TODO: the type is already in nfrSchema but that doesn't have "id" and
	// I can't add it dynamically here
	interface FRWithNFRs {
		id: number;
		functionalRequirement: string;
		identifiedNFRs: {
			id: string;
			attribute:
				| 'Functional Suitability'
				| 'Performance Efficiency'
				| 'Compatibility'
				| 'Usability'
				| 'Reliability'
				| 'Security'
				| 'Maintainability'
				| 'Flexibility'
				| 'Safety';
			requirement: string;
			justification: string;
		}[];
	}

	let { data: FR }: { data: { fr: FRWithNFRs | null } } = $props();

	let nfrScores = $state(
		FR.fr
			? FR.fr.identifiedNFRs.map((nfr) => ({
					id: nfr.id,
					attributeScore: 0, // Applicability score
					requirementScore: 0 // Validity score
				}))
			: null
	);

	// Handle form submission
	async function handleSubmit(event: Event) {
		event.preventDefault();
		// Check if any attribute or requirement score is 0
		const hasZeroScore = nfrScores?.some(
			(score) => score.attributeScore === 0 || score.requirementScore === 0
		);

		if (hasZeroScore) {
			addToast({
				message: 'Some scores are missing',
				type: 'danger'
			});
			return;
		}

		const payload = {
			id: FR.fr?.id,
			user: page.params.user,
			identifiedNFRs: nfrScores?.map((score) => ({
				id: score.id,
				attribute: score.attributeScore,
				requirement: score.requirementScore
			}))
		};
		const response = await fetch('/api/evaluate-nfr', {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.ok) {
			const result = await response.json();
			if (result.status === 'success') {
				location.reload();
			} else {
				addToast({
					message: 'Failed to submit evaluation',
					type: 'danger'
				});
			}
		} else {
			addToast({
				message: 'Failed to submit evaluation',
				type: 'danger'
			});
		}
	}
</script>

<form class="fr-evaluation" onsubmit={handleSubmit}>
	{#if FR.fr}
		<div class="fr-evaluation__header">
			<h1 class="fr-evaluation__title">Functional Requirement</h1>
			<p class="fr-evaluation__description">{FR.fr?.functionalRequirement}</p>
		</div>

		<div class="fr-evaluation__nfr-list">
			{#each FR.fr.identifiedNFRs as nfr, index}
				<table class="CrispTable" data-no-footer data-horizontal="true">
					<tbody>
						<tr>
							<th>
								<span>Attribute</span>
							</th>
							<td class="attribute Row--between">
								{nfr.attribute}
								<Grade type="Attribute" bind:level={nfrScores![index].attributeScore} />
							</td>
						</tr>
						<tr>
							<th>NFR</th>
							<td class="requirement Row--a-start gap-15">
								{nfr.requirement}
								<Grade type="NFR" bind:level={nfrScores![index].requirementScore} />
							</td>
						</tr>
						<tr>
							<th>Justification</th>
							<td>{nfr.justification}</td>
						</tr>
					</tbody>
				</table>
			{/each}
		</div>
		<button type="submit" class="CrispButton">Submit Evaluation</button>
	{:else}
		<p class="Row--center">
			You have evaluated all the NFRs assigned to you! Thank you for helping us out!
		</p>
	{/if}
</form>

<style lang="scss">
	.fr-evaluation {
		@include box(100%, auto);
		margin: 0 auto;
		padding: 0 0 50px 0;

		&__header {
			top: 64px;
			gap: 10px;
			z-index: 1000;
			padding: 10px 0 20px 0;
			position: sticky;
			background: #ffffff7a;
			border-bottom-right-radius: 6px;
			border-bottom-left-radius: 6px;
			backdrop-filter: blur(10px);
			@include make-flex($align: flex-start);
		}

		&__title {
			font-size: 24px;
		}

		&__description {
			font-size: 16px;
			color: var(--subFG);
			line-height: 1.5;
		}

		&__nfr-list {
			display: flex;
			flex-direction: column;
			gap: 20px;

			.attribute,
			.requirement {
				@include respondAt(875px) {
					gap: 10px;
					@include make-flex($align: flex-start);
				}
			}
		}

		.CrispButton {
			margin-top: 20px;
			margin-left: auto;
		}
	}
</style>
