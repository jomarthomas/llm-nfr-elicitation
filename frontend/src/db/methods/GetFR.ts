import { db } from '../.'; // Adjust path
import { frTable, nfrTable } from '../schema';
import { eq, and, sql } from 'drizzle-orm';

// Type for the output format
export interface FRWithNFRs {
	id: number;
	functionalRequirement: string;
	identifiedNFRs: {
		id: string;
		attribute:
			| 'Functional Suitability'
			| 'Performance Efficiency'
			| 'Compatibility'
			| 'Usability'
			| 'Reliability'
			| 'Security'
			| 'Maintainability'
			| 'Flexibility'
			| 'Safety';
		requirement: string;
		justification: string;
	}[];
}

export async function getRandomUnevaluated(): Promise<FRWithNFRs | null> {
	// Step 1: Select a random NFR with applicability = 0 and validity = 0
	const unevaluatedNFRs = await db
		.select({ frId: nfrTable.frId })
		.from(nfrTable)
		.where(and(eq(nfrTable.applicability, 0), eq(nfrTable.validity, 0)))
		.orderBy(sql`RANDOM()`)
		.limit(1);

	if (unevaluatedNFRs.length === 0) {
		return null; // No unevaluated NFRs found
	}

	const frId = unevaluatedNFRs[0].frId;

	// Step 2: Fetch the FR
	const frResult = await db
		.select({
			id: frTable.id,
			requirement: frTable.requirement
		})
		.from(frTable)
		.where(eq(frTable.id, frId))
		.limit(1);

	if (frResult.length === 0) {
		throw new Error('FR not found'); // Shouldn’t happen with foreign key constraints
	}

	const fr = frResult[0];

	// Step 3: Fetch all NFRs for this FR
	const nfrs = await db
		.select({
			id: nfrTable.id,
			attribute: nfrTable.attribute,
			requirement: nfrTable.requirement,
			justification: nfrTable.justification
		})
		.from(nfrTable)
		.where(eq(nfrTable.frId, frId));

	// Step 4: Format the result
	const result: FRWithNFRs = {
		id: fr.id, // Convert to string to match your example
		functionalRequirement: fr.requirement,
		identifiedNFRs: nfrs.map((nfr) => ({
			id: nfr.id,
			attribute: nfr.attribute,
			requirement: nfr.requirement,
			justification: nfr.justification
		}))
	};

	return result;
}

// Example usage
async function test() {
	const result = await getRandomUnevaluated();
	console.log(JSON.stringify(result, null, 2));
}

// test().catch(console.error);
