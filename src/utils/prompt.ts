import { z } from "npm:zod";

/**
 * Schema for validating a single NFR (Non-Functional Requirement) object.
 *
 * @property {string} functionalRequirement - The given functional requirement.
 * @property {Array<Object>} identifiedNFRs - A list of relevant NFRs for the given FR.
 * @property {string} identifiedNFRs[].attribute - The identified NFR category.
 * @property {string} identifiedNFRs[].requirement - An NFR that satisfies the given FR based on the selected attribute.
 * @property {string} identifiedNFRs[].justification - Explanation based on FR characteristics.
 */
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

/**
 * Schema for validating a batch of NFR objects.
 *
 * @property {Array<Object>} items - List of NFR objects.
 */
export const nfrBatchSchema = z.object({
  items: z.array(nfrSchema.describe("List of NFR objects")),
});

const prompt = `
${Deno.readTextFileSync("./data/prompt_tests/AdvancedPrompt.txt")}
{Given_FR}
`;

/**
 * Generates a prompt by replacing the placeholder with the given functional requirement.
 *
 * @param {string} req - The given functional requirement.
 * @returns {string} - The generated prompt.
 */
export function generatePrompt(req: string): string {
  return prompt.replace("{Given_FR}", req);
}

/**
 * Generates a batch prompt by replacing the placeholder with the given functional requirements.
 *
 * @param {string} reqs - The given functional requirements.
 * @returns {string} - The generated batch prompt.
 */
export function generateBatchPrompt(reqs: string): string {
  return prompt.replace("{Given_FR}", reqs);
}
