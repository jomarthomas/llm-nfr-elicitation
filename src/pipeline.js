// Coordinates all steps in the pipeline.

// pipeline.js
import queryLLM from "./llm-integration.js";
import { prepareInputForLLM } from "./preprocessing.js";
import { generateBasicPrompt, generateContextSpecificPrompt } from "./prompt-engineering.js";
import { refineNFRs } from "./post-processing.js";

export const generateNFRs = async (functionalRequirement, context = "") => {
  try {
    // Step 1: Preprocess input
    const input = prepareInputForLLM(functionalRequirement, context);

    // Step 2: Generate prompt
    const prompt = context
      ? generateContextSpecificPrompt(input.FunctionalRequirement, input.Context)
      : generateBasicPrompt(input.FunctionalRequirement);

    // Step 3: Query LLM
    const rawOutput = await queryLLM(prompt);

    // Step 4: Post-process output
    const nfrs = rawOutput.split("\n").map((line) => line.trim());
    const refinedOutput = refineNFRs(nfrs);

    return refinedOutput;
  } catch (error) {
    console.error("Error in NFR generation pipeline:", error.message);
    throw error;
  }
};
