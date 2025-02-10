import { z } from "zod";

const prompt = `
Task:
Given a Functional Requirement (FR), return a JSON object identifying relevant Non-Functional Requirements (NFRs) based on the FR's characteristics.

NFR Categories & Definitions:
Functional Suitability - Ensures the system meets stated and implied needs. Includes completeness, correctness, and appropriateness.
Performance Efficiency - Ensures the system operates within required time, resource, and capacity constraints. Includes time behavior, resource utilization, and scalability.
Compatibility - Ensures the system works well with other components or environments. Includes interoperability and co-existence.
Usability - Ensures ease of use and user experience. Includes learnability, operability, and user error protection.
Reliability - Ensures the system remains operational over time. Includes fault tolerance, recoverability, and availability.
Security - Ensures data protection and resistance to malicious actions. Includes confidentiality, integrity, authentication, and non-repudiation.
Maintainability - Ensures the system can be efficiently modified and tested. Includes modularity, modifiability, and testability.
Scalability & Flexibility - Ensures the system can adapt to increased load or environmental changes. Includes adaptability and scalability.
Safety - Ensures the system prevents harm to users, data, or the environment. Includes fail-safe mechanisms and risk identification.

Given functional requirement: {Given_FR}
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
            "Scalability & Flexibility",
            "Safety",
          ])
          .describe("The identified NFR category."),
        requirement: z
          .string()
          .describe("An NFR that satisfies the given FR based on the selected attribute"),
        justification: z
          .string()
          .describe("Explanation based on FR characteristics."),
      })
    )
    .describe("A list of relevant NFRs for the given FR."),
});

export function generatePrompt(req: string) {
  return prompt.replace("{Given_FR}", req);
}
