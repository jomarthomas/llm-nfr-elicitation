import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const payload = await request.json();

	return json({
		status: 'success'
	});
};
