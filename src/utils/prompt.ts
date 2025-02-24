import { z } from "npm:zod";

const promptAccessories = {
  batchStart: `You are given a list of Functional Requirements (FR), return a list of JSON objects identifying all the relevant Non-Functional Requirements (NFRs), that aligns with the standard, based on the FR's characteristics. `,
  batchEnd: `Given list of functional requirements: {Given_FR}`,
  singleStart: `You are given a Functional Requirement (FR), return a JSON object identifying all the relevant Non-Functional Requirements (NFRs), that aligns with the standard, based on the FR's characteristics. `,
  singleEnd: `Given functional requirement: {Given_FR}
`,
};


// - NFRs should be: specific, measurable, verifiable and unambiguous. 
// - NFRs must be technically specific enough for developers to implement and test against. They should provide clear, measurable criteria that leave no room for interpretation.

// Good Technical NFR Example:
// "The system must process user authentication requests within 200 milliseconds under a load of 10,000 concurrent users, with a maximum memory usage of 2GB"12

// Poor Technical NFR Example:
// "The system should be fast and efficient"

// For each Category, you can give multiple NFRs if you think the NFR can fit in multiple sub categories.
// For example: A FR can give 2 NFRs based on Functional Suitability, one for Functional Completeness and Functional Correctness. 
// To denote the sub category, you can use the format: "<subcategory>: <NFR>" in the "requirement" field. Each of the subcategory item should be its own separate item.


const prompt = `
You are an expert requirement engineer and you are well versed with the ISO/IEC 25010:2023(E), Systems and software Quality Requirements and Evaluation-Product quality model
{Start}

For each applicable attribute, specify:
- What is being measured
- Which specific metrics apply
- Quantifiable success criteria
- Testing/verification method


Each NFR must include:
- Clear numerical metrics
- Time constraints where applicable
- Specific testing conditions
- Resource constraints
- Performance boundaries

Avoid vague terms like:
- 'user-friendly'
- 'secure'
- 'efficient'
- 'robust'
- 'appropriate'

For each Category, you can give multiple NFRs if you think the NFR can fit in multiple sub categories.
For example: A FR can give 2 NFRs based on Functional Suitability, one for Functional Completeness and Functional Correctness. 
To denote the sub category, you can use the format: "<subcategory>: <NFR>" in the "requirement" field. 
*Each of the subcategory item should be its own separate item.*

Here's the gist of ISO/IEC 25010:2023(E) for your reference:
${Deno.readTextFileSync("./data/prompt tests/WithSubDefinitions")}

{End}
`;

export const nfrSchema = z.object({
  functionalRequirement: z
    .string()
    .describe("The given functional requirement."),
  identifiedNFRs: z
    .array(
      z.object({
        attribute: z
          .enum([
            "Functional Suitability",
            "Performance Efficiency",
            "Compatibility",
            "Usability",
            "Reliability",
            "Security",
            "Maintainability",
            "Flexibility",
            "Safety",
          ])
          .describe("The identified NFR category."),
        requirement: z
          .string()
          .describe(
            "An NFR that satisfies the given FR based on the selected attribute"
          ),
        justification: z
          .string()
          .describe("Explanation based on FR characteristics."),
      })
    )
    .describe("A list of relevant NFRs for the given FR."),
});

export const nfrBatchSchema = z.object({
  items: z.array(nfrSchema.describe("List of NFR objects")),
});

export function generatePrompt(req: string) {
  return prompt
    .replace("{Start}", promptAccessories.singleStart)
    .replace("{End}", promptAccessories.singleEnd)
    .replace("{Given_FR}", req);
}

export function generateBatchPrompt(reqs: string) {
  return prompt
    .replace("{Start}", promptAccessories.batchStart)
    .replace("{End}", promptAccessories.batchEnd)
    .replace("{Given_FR}", reqs);
}
