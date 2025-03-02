import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$db';
import { nfrTable } from '$db/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	const payload = (await request.json()) as {
		user: string;
		attrs: {
			[key: string]:
				| 'Functional Suitability'
				| 'Performance Efficiency'
				| 'Compatibility'
				| 'Usability'
				| 'Reliability'
				| 'Security'
				| 'Maintainability'
				| 'Flexibility'
				| 'Safety';
		};
	};

	await Promise.all([
		Object.keys(payload.attrs).forEach(async (id) => {
			console.log(id, payload.attrs[id]);
			await db.update(nfrTable).set({ humanAttr: payload.attrs[id] }).where(eq(nfrTable.id, id));
			await db.update(nfrTable).set({ attrUser: payload.user }).where(eq(nfrTable.id, id));
		})
	]).catch(() => {
		return json({
			status: 'error'
		});
	});

	return json({
		status: 'success'
	});
};
