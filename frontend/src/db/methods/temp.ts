import { db } from "$db";
import { frTable, nfrTable, type NFRTable } from "$db/schema";
import { and, eq, inArray } from "drizzle-orm";

async function countMaxNFRs() {
	const validUsers: {
		[key: string]: {
			FR: number[];
			model: NFRTable['llm'];
		};
	} = {
		santhosh: { FR: [25, 12, 23], model: 'grok-2' },
		jomar: { FR: [7, 20, 9], model: 'gpt-4o-mini' },
		key_3: { FR: [34, 3, 11], model: 'Qwen2.5-72B' },
		key_4: { FR: [29, 17, 10], model: 'gemini-1.5-pro' },
		key_5: { FR: [8, 32, 14], model: 'gpt-4o-mini' },
		key_6: { FR: [4, 13, 18], model: 'claude-3-5-haiku' },
		key_7: { FR: [21, 27, 6], model: 'claude-3-5-haiku' },
		key_8: { FR: [24, 15, 19], model: 'deepSeek-V3' },
		key_9: { FR: [2, 28, 26], model: 'claude-3-7-sonnet' },
		key_10: { FR: [30, 22, 16], model: 'lama-3.3-70B' }
	};
	let nfrs: { count: number; perUser: { user: string; count: number }[] } = {
		count: 0,
		perUser: []
	};
	for (const user of Object.keys(validUsers)) {
		const unevaluatedUserFRs = await db
			.select()
			.from(frTable)
			.where(inArray(frTable.id, validUsers[user].FR))
			.leftJoin(
				nfrTable,
				and(
					eq(nfrTable.applicability, 0),
					eq(nfrTable.validity, 0),
					eq(nfrTable.llm, validUsers[user].model),
					eq(frTable.id, nfrTable.frId)
				)
			);

		const result = unevaluatedUserFRs.reduce(
			(
				acc: { id: number; functionalRequirement: string; identifiedNFRs: any[] }[],
				{ frs, nfrs }
			) => {
				const existingFR = acc.find((item) => item.id === frs.id);
				const nfrData = {
					id: nfrs!.id,
					attribute: nfrs!.attribute,
					llm: nfrs!.llm,
					requirement: nfrs!.requirement,
					justification: nfrs!.justification,
					applicability: nfrs!.applicability,
					validity: nfrs!.validity,
					user: nfrs!.user
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

				return acc;
			},
			[]
		);

		nfrs.count += result.reduce((sum, item) => sum + item.identifiedNFRs.length, 0);
		nfrs.perUser.push({
			user,
			count: result.reduce((sum, item) => sum + item.identifiedNFRs.length, 0)
		});
	}
	console.log(nfrs);
}

async function countNFRsPerLLM() {
	const validUsers: {
		[key: string]: {
			FR: number[];
			model: NFRTable['llm'];
		};
	} = {
		santhosh: { FR: [25, 12, 23], model: 'grok-2' },
		jomar: { FR: [7, 20, 9], model: 'gpt-4o-mini' },
		key_3: { FR: [34, 3, 11], model: 'Qwen2.5-72B' },
		key_4: { FR: [29, 17, 10], model: 'gemini-1.5-pro' },
		key_5: { FR: [8, 32, 14], model: 'gpt-4o-mini' },
		key_6: { FR: [4, 13, 18], model: 'claude-3-5-haiku' },
		key_7: { FR: [21, 27, 6], model: 'claude-3-5-haiku' },
		key_8: { FR: [24, 15, 19], model: 'deepSeek-V3' },
		key_9: { FR: [2, 28, 26], model: 'claude-3-7-sonnet' },
		key_10: { FR: [30, 22, 16], model: 'lama-3.3-70B' }
	};

	let nfrsPerLLM: { [llm: string]: number } = {};

	for (const user of Object.keys(validUsers)) {
		const unevaluatedUserFRs = await db
			.select()
			.from(frTable)
			.leftJoin(
				nfrTable,
				and(
					eq(nfrTable.applicability, 0),
					eq(nfrTable.validity, 0),
					eq(nfrTable.llm, validUsers[user].model),
					eq(frTable.id, nfrTable.frId)
				)
			);

		const result = unevaluatedUserFRs.reduce(
			(
				acc: { id: number; functionalRequirement: string; identifiedNFRs: any[]; model: string }[],
				{ frs, nfrs }
			) => {
				const existingFR = acc.find((item) => item.id === frs.id);
				const nfrData = {
					id: nfrs?.id,
					attribute: nfrs?.attribute,
					llm: nfrs?.llm,
					requirement: nfrs?.requirement,
					justification: nfrs?.justification,
					applicability: nfrs?.applicability,
					validity: nfrs?.validity,
					user: nfrs?.user
				};

				if (existingFR) {
					existingFR.identifiedNFRs.push(nfrData);
				} else {
					acc.push({
						id: frs.id,
						functionalRequirement: frs.requirement,
						identifiedNFRs: [nfrData],
						model: nfrs?.llm ?? ''
					});
				}

				return acc;
			},
			[]
		);

		for (const item of result) {
			for (const nfr of item.identifiedNFRs) {
				if (nfr.llm) {
					if (nfrsPerLLM[nfr.llm]) {
						nfrsPerLLM[nfr.llm]++;
					} else {
						nfrsPerLLM[nfr.llm] = 1;
					}
				}
			}
		}
	}
	console.log(nfrsPerLLM);
}