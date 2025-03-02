<script lang="ts">
	import { page } from '$app/state';
	import Attributes from '$components/Attributes.svelte';
	import { addToast } from '$stores/ToastStore';

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
			humanAttr: '';
		}[];
	}

	let { data: NFR }: { data: { nfr: FRWithNFRs[] | null } } = $props();

	let nfrScores = $state(
		NFR.nfr
			? NFR.nfr.reduce(
					(
						acc: Record<
							string,
							| ''
							| 'Functional Suitability'
							| 'Performance Efficiency'
							| 'Compatibility'
							| 'Usability'
							| 'Reliability'
							| 'Security'
							| 'Maintainability'
							| 'Flexibility'
							| 'Safety'
						>,
						item
					) => {
						item.identifiedNFRs.forEach((nfr) => {
							acc[nfr.id] = nfr.humanAttr as
								| ''
								| 'Functional Suitability'
								| 'Performance Efficiency'
								| 'Compatibility'
								| 'Usability'
								| 'Reliability'
								| 'Security'
								| 'Maintainability'
								| 'Flexibility'
								| 'Safety';
						});
						return acc;
					},
					{} as Record<
						string,
						| ''
						| 'Functional Suitability'
						| 'Performance Efficiency'
						| 'Compatibility'
						| 'Usability'
						| 'Reliability'
						| 'Security'
						| 'Maintainability'
						| 'Flexibility'
						| 'Safety'
					>
				)
			: null
	);

	async function handleSubmit(event: Event) {
		event.preventDefault();

		const hasEmptyHumanAttr = Object.values(nfrScores!).some((score) => score === '');
		if (hasEmptyHumanAttr) {
			addToast({
				message: 'Some scores are missing',
				type: 'danger'
			});
			return;
		}

		const response = await fetch('/api/evaluate-attr', {
			method: 'POST',
			body: JSON.stringify({
				user: page.params.user,
				attrs: nfrScores
			}),
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
	{#if NFR.nfr && NFR.nfr.length > 0}
		<div class="fr-evaluation__header">
			<h1 class="fr-evaluation__title">Non Functional Requirement</h1>
		</div>

		<div class="fr-evaluation__nfr-list gap-10">
			{#each NFR.nfr as item}
				{#each item.identifiedNFRs as nfr, index}
					<table class="CrispTable" data-no-footer data-horizontal="true">
						<tbody>
							<tr>
								<th>Functional Requirement</th>
								<td class="requirement Row--a-start gap-15">
									{item.functionalRequirement}
								</td>
							</tr>
							<tr>
								<th>NFR</th>
								<td class="requirement Row--a-start gap-15">
									{nfr.requirement}
								</td>
							</tr>
							<tr>
								<th>
									<span>Attribute</span>
								</th>
								<td class="attribute Row--between">
									<Attributes bind:attr={nfrScores![nfr.id]} />
								</td>
							</tr>
						</tbody>
					</table>
				{/each}
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
			// top: 64px;
			gap: 10px;
			z-index: 1000;
			padding: 10px 0 20px 0;
			// position: sticky;
			background: #ffffff7a;
			border-bottom-right-radius: 6px;
			border-bottom-left-radius: 6px;
			backdrop-filter: blur(10px);
			@include make-flex($align: flex-start);
		}

		&__title {
			font-size: 24px;
		}

		// &__description {
		// 	font-size: 16px;
		// 	color: var(--subFG);
		// 	line-height: 1.5;
		// }

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
