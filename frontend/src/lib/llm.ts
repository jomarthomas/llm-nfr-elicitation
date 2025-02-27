import AdvancedPrompt from './AdvancedPrompt.txt?raw';

import { ChatOpenAI } from '@langchain/openai';
import { generateBatchPrompt, generatePrompt, nfrBatchSchema, nfrSchema } from './prompt';
import { ChatAnthropic } from '@langchain/anthropic';
import { BaseMessage } from '@langchain/core/messages';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Logger } from './logger';
import { ChatTogetherAI } from '@langchain/community/chat_models/togetherai';

interface StructuredLLMOutput {
	raw: BaseMessage;
	parsed: ReturnType<typeof nfrSchema.parse>;
}

// Define the abstract LLM Handler
export abstract class LLMHandler<
	TModel extends ChatAnthropic | ChatGoogleGenerativeAI | ChatTogetherAI | ChatOpenAI
> {
	constructor(
		protected model: TModel,
		public modelName: string
	) {}

	abstract health(): Promise<any>;
	abstract query(input: string): Promise<StructuredLLMOutput>;
	abstract batchQuery(inputs: string): Promise<StructuredLLMOutput[]>;
}

// OpenAI Handler
export class OpenAIHandler extends LLMHandler<ChatOpenAI> {
	constructor({
		apiKey,
		temperature,
		modelName
	}: {
		apiKey: string;
		temperature: number;
		modelName: string;
	}) {
		super(new ChatOpenAI({ openAIApiKey: apiKey, modelName, temperature }), modelName);
	}

	async health(): Promise<any> {
		try {
			const response = await this.model.invoke([['human', 'This is a health check']]);
			return response;
		} catch (error) {
			Logger.error('OpenAIHandler health check failed', error);
			return 'Health check failed';
		}
	}

	async query(input: string): Promise<StructuredLLMOutput> {
		try {
			const structuredLLM = this.model.withStructuredOutput(nfrSchema, {
				includeRaw: true,
				name: 'nfrSchema'
			});
			return await structuredLLM.invoke(generatePrompt(input));
		} catch (error) {
			Logger.error('OpenAIHandler query failed', error);
			throw new Error('Failed to query OpenAI model');
		}
	}

	async batchQuery(inputs: string): Promise<StructuredLLMOutput[]> {
		try {
			const structuredLLM = this.model.withStructuredOutput(nfrBatchSchema);
			const results = await structuredLLM.invoke(generateBatchPrompt(inputs));
			return results.items.map((result: any) => ({
				raw: result,
				parsed: nfrSchema.parse(result)
			}));
		} catch (error) {
			Logger.error('OpenAIHandler query failed', error);
			throw new Error('Failed to query OpenAI model');
		}
	}
}

// Anthropic Handler
export class AnthropicHandler extends LLMHandler<ChatAnthropic> {
	constructor({
		apiKey,
		temperature,
		modelName
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
						'anthropic-beta': 'prompt-caching-2024-07-31'
					}
				}
			}),
			modelName
		);
	}

	async health(): Promise<any> {
		try {
			const response = await this.model.invoke([['human', 'This is a health check']]);
			return response;
		} catch (error) {
			Logger.error('OpenAIHandler health check failed', error);
			return 'Health check failed';
		}
	}

	async query(input: string): Promise<StructuredLLMOutput> {
		try {
			const structuredLLM = this.model.withStructuredOutput(nfrSchema, {
				includeRaw: true,
				name: 'nfrSchema'
			});
			return await structuredLLM.invoke(generatePrompt(input));
		} catch (error) {
			Logger.error('AnthropicHandler query failed', error);
			throw new Error('Failed to query Anthropic model');
		}
	}

	async batchQuery(inputs: string): Promise<StructuredLLMOutput[]> {
		try {
			const structuredLLM = this.model.withStructuredOutput(nfrBatchSchema);
			// https://js.langchain.com/docs/integrations/chat/anthropic/#prompt-caching
			// Cache the prompt so we don't burn through all the credits
			const results = await structuredLLM.invoke([
				{
					role: 'system',
					content: [
						{
							type: 'text',
							text: `${AdvancedPrompt}
              You must always return valid JSON fenced by a markdown code block. Do not return any additional text.`,
							// Tell Anthropic to cache this block
							cache_control: { type: 'ephemeral' }
						}
					]
				},
				{
					role: 'user',
					content: inputs
				}
			]); //generateBatchPrompt(inputs));
			return results.items.map((result: any) => ({
				raw: result,
				parsed: result
			}));
		} catch (error) {
			Logger.error(`${this.modelName}-Handler query failed`, error);
			throw new Error(`Failed to query ${this.modelName} model`);
		}
	}
}

// Gemini Handler
export class GeminiHandler extends LLMHandler<ChatGoogleGenerativeAI> {
	constructor({
		apiKey,
		temperature,
		modelName
	}: {
		apiKey: string;
		temperature: number;
		modelName: string;
	}) {
		super(new ChatGoogleGenerativeAI({ apiKey, modelName, temperature }), modelName);
	}

	async health(): Promise<any> {
		try {
			const response = await this.model.invoke([['human', 'This is a health check']]);
			return response;
		} catch (error) {
			Logger.error('OpenAIHandler health check failed', error);
			return 'Health check failed';
		}
	}

	async query(input: string): Promise<StructuredLLMOutput> {
		try {
			const structuredLLM = this.model.withStructuredOutput(nfrSchema, {
				includeRaw: true,
				name: 'nfrSchema'
			});
			return await structuredLLM.invoke(generatePrompt(input));
		} catch (error) {
			Logger.error('GeminiHandler query failed', error);
			throw new Error('Failed to query Gemini model');
		}
	}

	async batchQuery(inputs: string): Promise<StructuredLLMOutput[]> {
		try {
			const structuredLLM = this.model.withStructuredOutput(nfrBatchSchema);
			const results = await structuredLLM.invoke(generateBatchPrompt(inputs));
			return results.items.map((result: any) => ({
				raw: result,
				parsed: nfrSchema.parse(result)
			}));
		} catch (error) {
			Logger.error('GeminiHandler query failed', error);
			throw new Error('Failed to query Gemini model');
		}
	}
}

// TogetherAI Handler
export class TogetherAIHandler extends LLMHandler<ChatTogetherAI> {
	constructor({
		apiKey,
		temperature,
		modelName
	}: {
		apiKey: string;
		temperature: number;
		modelName: string;
	}) {
		super(new ChatTogetherAI({ apiKey, model: modelName, temperature }), modelName);
	}

	async health(): Promise<any> {
		try {
			const response = await this.model.invoke([['human', 'This is a health check']]);
			return response;
		} catch (error) {
			Logger.error('OpenAIHandler health check failed', error);
			return 'Health check failed';
		}
	}

	async query(input: string): Promise<StructuredLLMOutput> {
		try {
			const structuredLLM = this.model.withStructuredOutput(nfrSchema, {
				includeRaw: true,
				name: 'nfrSchema'
			});
			return await structuredLLM.invoke(generatePrompt(input));
		} catch (error) {
			Logger.error(`${this.modelName}-Handler query failed`, error);
			throw new Error(`Failed to query ${this.modelName} model`);
		}
	}

	async batchQuery(inputs: string): Promise<StructuredLLMOutput[]> {
		try {
			const structuredLLM = this.model.withStructuredOutput(nfrBatchSchema);
			const results = await structuredLLM.invoke(`
          *DO NOT INCLUDE ANYTHING ELSE APART FROM A VALID JSON. DO NOT RESPOND WITH JSON INSIDE A MARKDOWN STRING. DO NOT INCLUDE BACKTICKS. RESPONSE SHOULD START WITH A OPEN CURLY BRACKET AND END WITH A CLOSED CURLY BRACKET AND IT SHOULD BE VALID JSON THAT CAN BE PARSED. WHILE PARSING THE OUTPUT WITH ZOD, THERE SHOULDN'T BE ANY ERRORS AT ALL. YOU SHOULD RETURN THE ARRAY INSIDE AN OBJECT WITH THE KEY "items"* 
        ${generateBatchPrompt(inputs)}`);
			return results.items.map((result: any) => ({
				raw: result,
				parsed: result
			}));
		} catch (error) {
			Logger.error(`${this.modelName}-Handler query failed`, error);
			throw new Error(`Failed to query ${this.modelName} model`);
		}
	}
}

// Grok Handler
export class GrokAIHandler extends LLMHandler<ChatOpenAI> {
	constructor({
		apiKey,
		temperature,
		modelName
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
					// Native langchain ChatXAI library has some issue with infinite recursion
					// and crashes deno, go figure
					// So we're just using openai's lib and change the endpoint
					baseURL: 'https://api.x.ai/v1'
				}
			}),
			modelName
		);
	}

	async health(): Promise<any> {
		try {
			const response = await this.model.invoke([['human', 'This is a health check']]);
			return response;
		} catch (error) {
			Logger.error('OpenAIHandler health check failed', error);
			return 'Health check failed';
		}
	}

	async query(input: string): Promise<StructuredLLMOutput> {
		try {
			const structuredLLM = this.model.withStructuredOutput(nfrSchema, {
				includeRaw: true,
				name: 'nfrSchema'
			});
			return await structuredLLM.invoke(generatePrompt(input));
		} catch (error) {
			Logger.error('OpenAIHandler query failed', error);
			throw new Error('Failed to query OpenAI model');
		}
	}

	async batchQuery(inputs: string): Promise<StructuredLLMOutput[]> {
		try {
			const structuredLLM = this.model.withStructuredOutput(nfrBatchSchema);
			const results = await structuredLLM.invoke(generateBatchPrompt(inputs));
			return results.items.map((result: any) => ({
				raw: result,
				parsed: nfrSchema.parse(result)
			}));
		} catch (error) {
			Logger.error('OpenAIHandler query failed', error);
			throw new Error('Failed to query OpenAI model');
		}
	}
}
