import { Logger } from "../logger.ts";
import {
  generateBatchPrompt,
  generatePrompt,
  nfrBatchSchema,
  nfrSchema,
} from "../prompt.ts";
import { LLMHandler, StructuredLLMOutput } from "./index.ts";
import { ChatOpenAI } from "npm:@langchain/openai";

/**
 * Handler for the Grok model.
 */
export class GrokAIHandler extends LLMHandler<ChatOpenAI> {
  /**
   * Constructs a GrokAIHandler.
   * @param apiKey - The API key for Grok.
   * @param temperature - The temperature setting for the model.
   * @param modelName - The name of the Grok model.
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
      new ChatOpenAI({
        openAIApiKey: apiKey,
        modelName,
        temperature,
        configuration: {
          baseURL: "https://api.x.ai/v1",
        },
      }),
      modelName
    );
  }

  /**
   * Checks the health of the Grok model.
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
   * Queries the Grok model with a single input.
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
      Logger.error("OpenAIHandler query failed", error);
      throw new Error("Failed to query OpenAI model");
    }
  }

  /**
   * Queries the Grok model with multiple inputs.
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
      Logger.error("OpenAIHandler query failed", error);
      throw new Error("Failed to query OpenAI model");
    }
  }
}
