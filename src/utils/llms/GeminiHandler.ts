import { Logger } from "../logger.ts";
import {
  generateBatchPrompt,
  generatePrompt,
  nfrBatchSchema,
  nfrSchema,
} from "../prompt.ts";
import { LLMHandler, StructuredLLMOutput } from "./index.ts";
import { ChatGoogleGenerativeAI } from "npm:@langchain/google-genai";

/**
 * Handler for the Gemini model.
 */
export class GeminiHandler extends LLMHandler<ChatGoogleGenerativeAI> {
  /**
   * Constructs a GeminiHandler.
   * @param apiKey - The API key for Gemini.
   * @param temperature - The temperature setting for the model.
   * @param modelName - The name of the Gemini model.
   */
  constructor({
    apiKey,
    temperature,
    modelName,
  }: {
    apiKey: string;
    temperature: number;
    modelName: string;
  }) {
    super(
      new ChatGoogleGenerativeAI({ apiKey, modelName, temperature }),
      modelName
    );
  }

  /**
   * Checks the health of the Gemini model.
   * @returns A promise that resolves to the health check result.
   */
  async health(): Promise<any> {
    try {
      const response = await this.model.invoke([
        ["human", "This is a health check"],
      ]);
      return response;
    } catch (error) {
      Logger.error("OpenAIHandler health check failed", error);
      return "Health check failed";
    }
  }

  /**
   * Queries the Gemini model with a single input.
   * @param input - The input string to query the model with.
   * @returns A promise that resolves to the structured output from the model.
   */
  async query(input: string): Promise<StructuredLLMOutput> {
    try {
      const structuredLLM = this.model.withStructuredOutput(nfrSchema, {
        includeRaw: true,
        name: "nfrSchema",
      });
      return await structuredLLM.invoke(generatePrompt(input));
    } catch (error) {
      Logger.error("GeminiHandler query failed", error);
      throw new Error("Failed to query Gemini model");
    }
  }

  /**
   * Queries the Gemini model with multiple inputs.
   * @param inputs - JSON string of a list of FRs to query the model with.
   * @returns A promise that resolves to an array of structured outputs from the model.
   */
  async batchQuery(inputs: string): Promise<StructuredLLMOutput[]> {
    try {
      const structuredLLM = this.model.withStructuredOutput(nfrBatchSchema);
      const results = await structuredLLM.invoke(generateBatchPrompt(inputs));
      return results.items.map((result: any) => ({
        raw: result,
        parsed: nfrSchema.parse(result),
      }));
    } catch (error) {
      Logger.error("GeminiHandler query failed", error);
      throw new Error("Failed to query Gemini model");
    }
  }
}
