import {
	CLAUDE_API_KEY,
	GOOGLE_API_KEY,
	GROK_API_KEY,
	OPENAI_API_KEY,
	TOGETH_API_KEY
} from '$env/static/private';
import {
	AnthropicHandler,
	GeminiHandler,
	GrokAIHandler,
	OpenAIHandler,
	TogetherAIHandler
} from '$lib/llm';
import type { Actions } from './$types';

export const actions: Actions = {
	query: async ({ request, locals }) => {
		const data = await request.formData();
		const fr = data.get('fr') as string;
		const model = data.get('model') as string;
		console.log(fr, model)

		if (fr === '') {
			return {
				error: 'Cannot generate NFR for a empty string'
			};
		}

		if (model === 'gemini-1.5-pro') {
			const gemini = new GeminiHandler({
				apiKey: GOOGLE_API_KEY,
				modelName: 'gemini-1.5-pro',
				temperature: 0.4
			});
			return (await gemini.query(fr)).parsed;
		} else if (model === 'gpt-4o-mini') {
			const openai = new OpenAIHandler({
				apiKey: OPENAI_API_KEY,
				modelName: 'gpt-4o-mini',
				temperature: 0.4
			});
			return (await openai.query(fr)).parsed;
		} else if (model === 'deepseek-ai/DeepSeek-V3') {
			const deepseek = new TogetherAIHandler({
				apiKey: TOGETH_API_KEY,
				modelName: 'deepseek-ai/DeepSeek-V3',
				temperature: 0.4
			});
			return (await deepseek.query(fr)).parsed;
		} else if (model === 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free') {
			const llama = new TogetherAIHandler({
				apiKey: TOGETH_API_KEY,
				modelName: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
				temperature: 0.4
			});
			return (await llama.query(fr)).parsed;
		} else if (model === 'Qwen/Qwen2.5-72B-Instruct-Turbo') {
			const qwen = new TogetherAIHandler({
				apiKey: TOGETH_API_KEY,
				modelName: 'Qwen/Qwen2.5-72B-Instruct-Turbo',
				temperature: 0.4
			});
			return (await qwen.query(fr)).parsed;
		} else if (model === 'claude-3-5-haiku-20241022') {
			const claude = new AnthropicHandler({
				apiKey: CLAUDE_API_KEY,
				modelName: 'claude-3-5-haiku-20241022',
				temperature: 0.4
			});
			return (await claude.query(fr)).parsed;
		} else if (model === 'grok-2-1212') {
			const grok = new GrokAIHandler({
				apiKey: GROK_API_KEY,
				modelName: 'grok-2-1212',
				temperature: 0.4
			});
			return (await grok.query(fr)).parsed;
		}
	}
};
