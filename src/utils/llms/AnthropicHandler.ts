import { Logger } from "../logger.ts";
import {
  generateBatchPrompt,
  generatePrompt,
  nfrBatchSchema,
  nfrSchema,
} from "../prompt.ts";
import { LLMHandler, StructuredLLMOutput } from "./index.ts";
import { ChatAnthropic } from "npm:@langchain/anthropic";

/**
 * Handler for the Anthropic model.
 */
export class AnthropicHandler extends LLMHandler<ChatAnthropic> {
  /**
   * Constructs an AnthropicHandler.
   * @param apiKey - The API key for Anthropic.
   * @param temperature - The temperature setting for the model.
   * @param modelName - The name of the Anthropic model.
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
      new ChatAnthropic({
        anthropicApiKey: apiKey,
        modelName,
        temperature,
        cache: true,
        clientOptions: {
          defaultHeaders: {
            "anthropic-beta": "prompt-caching-2024-07-31",
          },
        },
      }),
      modelName
    );
  }

  /**
   * Checks the health of the Anthropic model.
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
   * Queries the Anthropic model with a single input.
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
      Logger.error("AnthropicHandler query failed", error);
      throw new Error("Failed to query Anthropic model");
    }
  }

  /**
   * Queries the Anthropic model with multiple inputs.
   * @param inputs - JSON string of a list of FRs to query the model with.
   * @returns A promise that resolves to an array of structured outputs from the model.
   */
  async batchQuery(inputs: string): Promise<StructuredLLMOutput[]> {
    try {
      const structuredLLM = this.model.withStructuredOutput(nfrBatchSchema);
      // https://js.langchain.com/docs/integrations/chat/anthropic/#prompt-caching
      // Cache the prompt so we don't burn through all the credits
      const results = await structuredLLM.invoke([
        {
          role: "system",
          content: [
            {
              type: "text",
              text: `${Deno.readTextFileSync(
                "./data/prompts/AdvancedPrompt.txt"
              )}
              You must always return valid JSON fenced by a markdown code block. Do not return any additional text.`,
              cache_control: { type: "ephemeral" },
            },
          ],
        },
        {
          role: "user",
          content: inputs,
        },
      ]);
      return results.items.map((result: any) => ({
        raw: result,
        parsed: result,
      }));
    } catch (error) {
      Logger.error(`${this.modelName}-Handler query failed`, error);
      throw new Error(`Failed to query ${this.modelName} model`);
    }
  }
}
