import { Logger } from "../logger.ts";
import {
  generateBatchPrompt,
  generatePrompt,
  nfrBatchSchema,
  nfrSchema,
} from "../prompt.ts";
import { LLMHandler, StructuredLLMOutput } from "./index.ts";
import { ChatTogetherAI } from "npm:@langchain/community/chat_models/togetherai";

/**
 * Handler for the TogetherAI model.
 */
export class TogetherAIHandler extends LLMHandler<ChatTogetherAI> {
  /**
   * Constructs a TogetherAIHandler.
   * @param apiKey - The API key for TogetherAI.
   * @param temperature - The temperature setting for the model.
   * @param modelName - The name of the TogetherAI model.
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
      new ChatTogetherAI({ apiKey, model: modelName, temperature }),
      modelName
    );
  }

  /**
   * Checks the health of the TogetherAI model.
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
   * Queries the TogetherAI model with a single input.
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
      Logger.error(`${this.modelName}-Handler query failed`, error);
      throw new Error(`Failed to query ${this.modelName} model`);
    }
  }

  /**
   * Queries the TogetherAI model with multiple inputs.
   * @param inputs - JSON string of a list of FRs to query the model with.
   * @returns A promise that resolves to an array of structured outputs from the model.
   */
  async batchQuery(inputs: string): Promise<StructuredLLMOutput[]> {
    try {
      const structuredLLM = this.model.withStructuredOutput(nfrBatchSchema);
      const results = await structuredLLM.invoke(`
          *DO NOT INCLUDE ANYTHING ELSE APART FROM A VALID JSON. DO NOT RESPOND WITH JSON INSIDE A MARKDOWN STRING. DO NOT INCLUDE BACKTICKS. RESPONSE SHOULD START WITH A OPEN CURLY BRACKET AND END WITH A CLOSED CURLY BRACKET AND IT SHOULD BE VALID JSON THAT CAN BE PARSED. WHILE PARSING THE OUTPUT WITH ZOD, THERE SHOULDN'T BE ANY ERRORS AT ALL. YOU SHOULD RETURN THE ARRAY INSIDE AN OBJECT WITH THE KEY "items"* 
        ${generateBatchPrompt(inputs)}`);
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
