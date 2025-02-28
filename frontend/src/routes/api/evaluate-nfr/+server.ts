import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$db';
import { eq, inArray, sql, type SQL } from 'drizzle-orm';
import { nfrTable } from '$db/schema';

export const POST: RequestHandler = async ({ request }) => {
	const payload = (await request.json()) as {
		id: number;
		identifiedNFRs: [
			{
				id: string;
				attribute: number;
				requirement: number;
			}
		];
	};
	// {
	// 	id: 8,
	// 	identifiedNFRs: [
	// 		{
	// 			id: 'c52bfc14-e648-4fb1-8586-0748e5ac643f',
	// 			attribute: 3,
	// 			requirement: 3
	// 		},
	// 		{
	// 			id: '687ca3d2-0d5a-47b6-b50e-3454cd90ac63',
	// 			attribute: 2,
	// 			requirement: 3
	// 		}
	// 	]
	// }

	const updates = [];
	for (const item in payload.identifiedNFRs) {
		const element = payload.identifiedNFRs[item];
		console.log(element);
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
	}
	await Promise.all(updates);

	return json({
		status: 'success'
	});
};
