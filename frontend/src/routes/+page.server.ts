import { GOOGLE_API_KEY } from '$env/static/private';
import { GeminiHandler } from '$lib/llm';
import type { Actions } from './$types';

export const actions: Actions = {
	query: async ({ request, locals }) => {
		const data = await request.formData();
		const fr = data.get('fr') as string;

		if (fr === '') {
			return {
				error: 'Cannot generate NFR for a empty string'
			};
		}

		const gemini = new GeminiHandler({
			apiKey: GOOGLE_API_KEY,
			modelName: data.get('model') as string,
			temperature: 0.7
		});

		return (await gemini.query(fr)).parsed;
	}
};
