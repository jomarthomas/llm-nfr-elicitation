import { ChatOpenAI } from "npm:@langchain/openai";
import { generatePrompt, nfrSchema } from "./Promt.ts";
import { ChatAnthropic } from "npm:@langchain/anthropic";
import { BaseMessage } from "npm:@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "npm:@langchain/google-genai";
import { Logger } from "./logger.ts";

interface StructuredLLMOutput {
  raw: BaseMessage;
  parsed: ReturnType<typeof nfrSchema.parse>;
}

// Define the abstract LLM Handler
abstract class LLMHandler<
  TModel extends ChatOpenAI | ChatAnthropic | ChatGoogleGenerativeAI
> {
  constructor(protected model: TModel) {}

  abstract query(input: string): Promise<StructuredLLMOutput>;
}

// OpenAI Handler
export class OpenAIHandler extends LLMHandler<ChatOpenAI> {
  constructor({
    apiKey,
    temperature,
    modelName,
  }: {
    apiKey: string;
    temperature: number;
    modelName: string;
  }) {
    super(new ChatOpenAI({ openAIApiKey: apiKey, modelName, temperature }));
  }

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
}

// Anthropic Handler
export class AnthropicHandler extends LLMHandler<ChatAnthropic> {
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
      new ChatAnthropic({ anthropicApiKey: apiKey, modelName, temperature })
    );
  }

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
}

// Gemini Handler
export class GeminiHandler extends LLMHandler<ChatGoogleGenerativeAI> {
  constructor({
    apiKey,
    temperature,
    modelName,
  }: {
    apiKey: string;
    temperature: number;
    modelName: string;
  }) {
    super(new ChatGoogleGenerativeAI({ apiKey, modelName, temperature }));
  }

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
}
