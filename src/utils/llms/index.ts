import { BaseMessage } from "npm:@langchain/core/messages";
import { nfrSchema } from "../prompt.ts";
import { ChatOpenAI } from "npm:@langchain/openai";
import { ChatAnthropic } from "npm:@langchain/anthropic";
import { ChatGoogleGenerativeAI } from "npm:@langchain/google-genai";
import { ChatTogetherAI } from "npm:@langchain/community/chat_models/togetherai";

/**
 * Interface representing the structured output from an LLM.
 */
export interface StructuredLLMOutput {
  raw: BaseMessage;
  parsed: ReturnType<typeof nfrSchema.parse>;
}

/**
 * Abstract class representing a handler for an LLM model.
 * @template TModel - The type of the LLM model.
 */
export abstract class LLMHandler<
  TModel extends
    | ChatAnthropic
    | ChatGoogleGenerativeAI
    | ChatTogetherAI
    | ChatOpenAI
> {
  /**
   * Constructs an LLMHandler.
   * @param model - The LLM model instance.
   * @param modelName - The name of the LLM model.
   */
  constructor(protected model: TModel, public modelName: string) {}

  /**
   * Checks the health of the LLM model.
   * @returns A promise that resolves to the health check result.
   */
  abstract health(): Promise<any>;

  /**
   * Queries the LLM model with a single input(FR).
   * @param input - The input string to query the model with.
   * @returns A promise that resolves to the structured output from the model.
   */
  abstract query(input: string): Promise<StructuredLLMOutput>;

  /**
   * Queries the LLM model with a list of inputs(FRs).
   * @param inputs - JSON string of a list of FRs to query the model with.
   * @returns A promise that resolves to an array of structured outputs from the model.
   */
  abstract batchQuery(inputs: string): Promise<StructuredLLMOutput[]>;
}

import { GeminiHandler } from "./GeminiHandler.ts";
import { OpenAIHandler } from "./OpenAIHandler.ts";
import { TogetherAIHandler } from "./TogetherAIHandler.ts";
import { AnthropicHandler } from "./AnthropicHandler.ts";
import { GrokAIHandler } from "./GrokAIHandler.ts";

export {
  GeminiHandler,
  OpenAIHandler,
  TogetherAIHandler,
  AnthropicHandler,
  GrokAIHandler,
};
