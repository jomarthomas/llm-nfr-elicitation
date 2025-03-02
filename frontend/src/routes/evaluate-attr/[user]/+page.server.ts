import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$db';
import { frTable, nfrTable, type NFRTable } from '$db/schema';
import { and, eq, inArray } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const userName = params.user;
	if (userName === undefined || userName.length === 0) {
		throw redirect(307, '/?error=Unauthorized');
	}

	const validUsers: {
		[key: string]: {
			FR: number[];
			model: NFRTable['llm'];
		};
	} = {
		santhosh: { FR: [7, 20, 9], model: 'grok-2' },
		jomar: { FR: [34, 3, 11], model: 'gpt-4o-mini' },
		key_3: { FR: [29, 17, 10], model: 'Qwen2.5-72B' },
		key_4: { FR: [8, 32, 14], model: 'gemini-1.5-pro' },
		key_5: { FR: [4, 13, 18], model: 'gpt-4o-mini' },
		key_6: { FR: [21, 27, 6], model: 'claude-3-5-haiku' },
		key_7: { FR: [24, 15, 19], model: 'claude-3-5-haiku' },
		key_8: { FR: [2, 28, 26], model: 'deepSeek-V3' },
		key_9: { FR: [30, 22, 16], model: 'claude-3-7-sonnet' },
		key_10: { FR: [25, 12, 23], model: 'lama-3.3-70B' }
	};

	if (!Object.keys(validUsers).includes(userName)) {
		throw redirect(307, '/?error=Unauthorized');
	}

	const unevaluatedNFRs = await db
		.select()
		.from(nfrTable)
		.where(
			and(
				inArray(nfrTable.frId, validUsers[userName].FR),
				eq(nfrTable.humanAttr, ''),
				eq(nfrTable.llm, validUsers[userName].model)
			)
		)
		.leftJoin(frTable, eq(nfrTable.frId, frTable.id));

	// console.log(unevaluatedNFRs)

	const result = unevaluatedNFRs.reduce(
		(
			acc: { id: number; functionalRequirement: string; identifiedNFRs: any[] }[],
			{ frs, nfrs }
		) => {
			const existingFR = acc.find((item) => item.id === frs?.id);
			if (nfrs) {
				const nfrData = {
					id: nfrs!.id,
					attribute: nfrs!.attribute,
					llm: nfrs!.llm,
					requirement: nfrs!.requirement,
					justification: nfrs!.justification,
					applicability: nfrs!.applicability,
					validity: nfrs!.validity,
					nfrUser: nfrs!.nfrUser
				};

				if (existingFR) {
					existingFR.identifiedNFRs.push(nfrData);
				} else {
					acc.push({
						id: frs?.id!,
						functionalRequirement: frs?.requirement!,
						identifiedNFRs: [nfrData]
					});
				}
			}

			return acc;
		},
		[]
	);
	return {
		// nfr: result.length > 0 ? result[Math.floor(Math.random() * result.length)] : null
		nfr: result
	};
};
