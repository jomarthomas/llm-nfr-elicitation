import {
  AnthropicHandler,
  GeminiHandler,
  GrokAIHandler,
  OpenAIHandler,
  TogetherAIHandler,
} from "./utils/llms/index.ts";
import { batchedCalls, combineOutputs } from "./utils/outputProcessing.ts";

if (import.meta.main) {
  const gemini = new GeminiHandler({
    apiKey: Deno.env.get("GOOGLE_API_KEY") ?? "",
    modelName: "gemini-1.5-pro",
    temperature: 0.4,
  });
  const openai = new OpenAIHandler({
    apiKey: Deno.env.get("OPENAI_API_KEY") ?? "",
    modelName: "gpt-4o-mini",
    temperature: 0.4,
  });
  const deepseek = new TogetherAIHandler({
    apiKey: Deno.env.get("TOGETH_API_KEY") ?? "",
    modelName: "deepseek-ai/DeepSeek-V3",
    temperature: 0.4,
  });
  const llama = new TogetherAIHandler({
    apiKey: Deno.env.get("TOGETH_API_KEY") ?? "",
    modelName: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
    temperature: 0.4,
  });
  const qwen = new TogetherAIHandler({
    apiKey: Deno.env.get("TOGETH_API_KEY") ?? "",
    modelName: "Qwen/Qwen2.5-72B-Instruct-Turbo",
    temperature: 0.4,
  });
  const claude37 = new AnthropicHandler({
    apiKey: Deno.env.get("CLAUDE_API_KEY") ?? "",
    modelName: "claude-3-7-sonnet-20250219",
    temperature: 0.4,
  });
  const grok = new GrokAIHandler({
    apiKey: Deno.env.get("GROK_API_KEY") ?? "",
    modelName: "grok-2-1212",
    temperature: 0.4,
  });
  const claude35 = new AnthropicHandler({
    apiKey: Deno.env.get("CLAUDE_API_KEY") ?? "",
    modelName: "claude-3-5-haiku-20241022",
    temperature: 0.4,
  });

  const reqs = Promise.all([
    await batchedCalls({
      model: gemini,
      batchSize: 2,
      fileName: "gemini-1.5-pro",
    }).then(async () => {
      await combineOutputs("gemini-1.5-pro");
    }),
    await batchedCalls({
      model: claude37,
      batchSize: 2,
      fileName: "claude-3-7-sonnet",
    }).then(async () => {
      await combineOutputs("claude-3-7-sonnet");
    }),
    await batchedCalls({
      model: claude35,
      batchSize: 2,
      fileName: "claude-3-5-haiku",
    }).then(async () => {
      await combineOutputs("claude-3-5-haiku");
    }),
    await batchedCalls({
      model: deepseek,
      batchSize: 2,
      fileName: "deepSeek-V3",
    }).then(async () => {
      await combineOutputs("deepSeek-V3");
    }),
    await batchedCalls({
      model: openai,
      batchSize: 2,
      fileName: "gpt-4o-mini",
    }).then(async () => {
      await combineOutputs("gpt-4o-mini");
    }),
    await batchedCalls({
      model: grok,
      batchSize: 2,
      fileName: "grok-2",
    }).then(async () => {
      await combineOutputs("grok-2");
    }),
    await batchedCalls({
      model: llama,
      batchSize: 2,
      fileName: "lama-3.3-70B",
    }).then(async () => {
      await combineOutputs("lama-3.3-70B");
    }),
    await batchedCalls({
      model: qwen,
      batchSize: 2,
      fileName: "Qwen2.5-72B",
    }).then(async () => {
      await combineOutputs("Qwen2.5-72B");
    }),
  ]);
}
