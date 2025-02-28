<script lang="ts">
	import { deserialize } from '$app/forms';
	import BlurredSpinner from '$components/BlurredSpinner.svelte';
	import type { nfrSchema } from '$lib/prompt';
	import type { ActionResult } from '@sveltejs/kit';

	
	const models = [
		{
			name: 'OpenAI',
			mode: 'gpt-4o-mini'
		},
		{
			name: 'Google AI',
			model: 'gemini-1.5-pro'
		},
		{
			name: 'Deepseek',
			model: 'deepseek-ai/DeepSeek-V3'
		},
		{
			name: 'Llama',
			model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free'
		},
		{
			name: 'Qwen',
			model: 'Qwen/Qwen2.5-72B-Instruct-Turbo'
		},
		{
			name: 'Claude',
			model: 'claude-3-5-haiku-20241022'
		},
		{
			name: 'Grok',
			model: 'grok-2-1212'
		}
	];

	let selectedModel = $state(models[1].model);
	let formLoading = $state(false);
	let nfrResult: undefined | Zod.infer<typeof nfrSchema> = $state();
</script>

<main class="Home">
	<h2>LLM Based NFR Elicitation</h2>
	<p>
		Generate Non-Functional Requirements with Large Language Models with just Functional requirement
	</p>

	<form
		class="Home__input"
		action="?/query"
		method="POST"
		onsubmit={async (event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) => {
			event.preventDefault();
			formLoading = true;
			const data = new FormData(event.currentTarget);

			const response = await fetch(event.currentTarget.action, {
				method: 'POST',
				body: data
			});

			const result: ActionResult = deserialize(await response.text());
			if (result.status === 200) {
				//@ts-ignore
				nfrResult = result.data;
			}
			formLoading = false;
		}}
	>
		{#if formLoading}
			<BlurredSpinner />
		{/if}
		{#if nfrResult}
			<table class="CrispTable" data-no-footer>
				<thead>
					<tr>
						<th>Attribute</th>
						<th>NFR</th>
					</tr>
				</thead>
				<tbody>
					{#each nfrResult.identifiedNFRs as nfrItem}
						<tr>
							<td>{nfrItem.attribute}</td>
							<td>{nfrItem.requirement}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
		<textarea class="CrispInput" id="fr" name="fr" data-type="text-area"></textarea>
		<div class="Home__tools">
			<input type="text" name="model" id="model" hidden bind:value={selectedModel} />
			<select class="CrispSelect" bind:value={selectedModel}>
				{#each models as item}
					<option value={item.model}>{item.name}</option>
				{/each}
			</select>
			<button class="CrispButton" type="submit">Generate</button>
		</div>
	</form>
</main>

<style lang="scss">
	.Home {
		text-align: center;
		@include make-flex();
		@include box(100%, auto);
		& > h2 {
			font-size: 3rem;
			margin-bottom: 1rem;
		}

		& > p {
			font-size: 1.5rem;
			max-width: 600px;
		}

		&__input {
			gap: 10px;
			padding: 10px;
			margin-top: 40px;
			min-height: 128px;
			position: relative;
			border-radius: 20px;
			@include make-flex();
			@include box(100%, auto);
			border: 1px solid var(--t-crp-border);

			box-shadow:
				rgba(0, 0, 0, 0) 0px 0px 0px 0px,
				rgba(0, 0, 0, 0) 0px 0px 0px 0px,
				rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

			& > textarea {
				font-size: 17px;
			}
		}

		&__tools {
			gap: 10px;
			@include box();
			@include make-flex($dir: row, $just: space-between);
		}
	}
</style>
