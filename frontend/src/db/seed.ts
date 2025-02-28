import { db } from '.';
import { frTable, nfrTable, type NFRTable } from './schema';

import { eq } from 'drizzle-orm';

import claudeHaiku from '../data/LLMOutputs/claude-3-5-haiku.json';
import claudeSonnet from '../data/LLMOutputs/claude-3-7-sonnet.json';
import deepSeek from '../data/LLMOutputs/deepSeek-V3.json';
import gemini from '../data/LLMOutputs/gemini-1.5-pro.json';
import gpt from '../data/LLMOutputs/gpt-4o-mini.json';
import grok from '../data/LLMOutputs/grok-2.json';
import lama from '../data/LLMOutputs/lama-3.3-70B.json';
import Qwen2 from '../data/LLMOutputs/Qwen2.5-72B.json';

// Map of LLM names to their data
const llmData = [
	{ name: 'claude-3-5-haiku', data: claudeHaiku },
	{ name: 'claude-3-7-sonnet', data: claudeSonnet },
	{ name: 'deepSeek-V3', data: deepSeek },
	{ name: 'gemini-1.5-pro', data: gemini },
	{ name: 'gpt-4o-mini', data: gpt },
	{ name: 'grok-2', data: grok },
	{ name: 'lama-3.3-70B', data: lama },
	{ name: 'Qwen2.5-72B', data: Qwen2 }
];

async function seed() {
	// Step 1: Collect unique FRs and insert them
	const uniqueFRs = new Map<string, number>(); // Map<requirement, frId>

	for (const { data } of llmData) {
		for (const fr of data) {
			const requirement = fr.functionalRequirement;
			if (!uniqueFRs.has(requirement)) {
				const insertedFR = await db
					.insert(frTable)
					.values({ requirement })
					.returning({ id: frTable.id });
				uniqueFRs.set(requirement, insertedFR[0].id);
			}
		}
	}

	// Step 2: Insert NFRs with corresponding FR IDs and LLM names
	const nfrInserts = [];
	for (const { name: llm, data } of llmData) {
		for (const fr of data) {
			const frId = uniqueFRs.get(fr.functionalRequirement)!;
			for (const nfr of fr.identifiedNFRs) {
				nfrInserts.push({
					id: crypto.randomUUID(), // Generate random ID
					frId,
					attribute: nfr.attribute as NFRTable['attribute'],
					requirement: nfr.requirement,
					justification: nfr.justification,
					applicability: 0,
					validity: 0,
					llm: llm as NFRTable['llm']
				});
			}
		}
	}

	// Batch insert NFRs for efficiency
	await db.insert(nfrTable).values(nfrInserts);

	console.log(`Seeded ${uniqueFRs.size} FRs and ${nfrInserts.length} NFRs successfully!`);
}

seed().catch((error) => {
	console.error('Seeding failed:', error);
	process.exit(1);
});
