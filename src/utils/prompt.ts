import { z } from "npm:zod";

const promptAccessories = {
  batchStart: `You are given a list of Functional Requirements (FR), return a list of JSON objects identifying all the relevant Non-Functional Requirements (NFRs), that aligns with the standard, based on the FR's characteristics. `,
  batchEnd: `Given list of functional requirements: {Given_FR}`,
  singleStart: `You are given a Functional Requirement (FR), return a JSON object identifying all the relevant Non-Functional Requirements (NFRs), that aligns with the standard, based on the FR's characteristics. `,
  singleEnd: `Given functional requirement: {Given_FR}
`,
};

const prompt = `
${Deno.readTextFileSync("./data/prompt tests/Advanced")}
{Given_FR}
`

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
