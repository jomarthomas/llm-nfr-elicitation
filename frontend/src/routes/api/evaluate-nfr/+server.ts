import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$db';
import { eq } from 'drizzle-orm';
import { nfrTable } from '$db/schema';

export const POST: RequestHandler = async ({ request }) => {
	const payload = (await request.json()) as {
		id: number;
		user: string;
		identifiedNFRs: [
			{
				id: string;
				attribute: number;
				requirement: number;
			}
		];
	};

	const updates = [];
	for (const item in payload.identifiedNFRs) {
		const element = payload.identifiedNFRs[item];
		updates.push(
			await db
				.update(nfrTable)
				.set({ applicability: element.attribute })
				.where(eq(nfrTable.id, element.id))
		);
		updates.push(
			await db
				.update(nfrTable)
				.set({ validity: element.requirement })
				.where(eq(nfrTable.id, element.id))
		);

		updates.push(
			await db.update(nfrTable).set({ user: payload.user }).where(eq(nfrTable.id, element.id))
		);
	}
	await Promise.all(updates);

	return json({
		status: 'success'
	});
};
