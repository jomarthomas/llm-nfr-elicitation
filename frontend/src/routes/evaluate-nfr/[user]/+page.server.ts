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
		santhosh: { FR: [25, 12, 23], model: 'grok-2' },
		jomar: { FR: [7, 20, 9], model: 'gpt-4o-mini' },
		sanjay: { FR: [34, 3, 11], model: 'Qwen2.5-72B' },
		alejandra: { FR: [29, 17, 10], model: 'gemini-1.5-pro' },
		yang: { FR: [8, 32, 14], model: 'gpt-4o-mini' },
		stephanie: { FR: [4, 13, 18], model: 'claude-3-5-haiku' },
		jared: { FR: [21, 27, 6], model: 'claude-3-5-haiku' },
		ariela: { FR: [24, 15, 19], model: 'deepSeek-V3' },
		diana: { FR: [2, 28, 26], model: 'claude-3-7-sonnet' },
		felix: { FR: [30, 22, 16], model: 'lama-3.3-70B' }
	};

	if (!Object.keys(validUsers).includes(userName)) {
		throw redirect(307, '/?error=Unauthorized');
	}
	const unevaluatedUserFRs = await db
		.select()
		.from(frTable)
		.where(inArray(frTable.id, validUsers[userName].FR))
		.leftJoin(
			nfrTable,
			and(
				eq(nfrTable.applicability, 0),
				eq(nfrTable.validity, 0),
				eq(nfrTable.llm, validUsers[userName].model),
				eq(frTable.id, nfrTable.frId)
			)
		);
	const result = unevaluatedUserFRs.reduce(
		(
			acc: { id: number; functionalRequirement: string; identifiedNFRs: any[] }[],
			{ frs, nfrs }
		) => {
			const existingFR = acc.find((item) => item.id === frs.id);
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
						id: frs.id,
						functionalRequirement: frs.requirement,
						identifiedNFRs: [nfrData]
					});
				}
			}

			return acc;
		},
		[]
	);

	return {
		fr: result.length > 0 ? result[Math.floor(Math.random() * result.length)] : null
	};
};
