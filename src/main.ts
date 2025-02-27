import Papa from "npm:papaparse";
import {
  GeminiHandler,
  OpenAIHandler,
  TogetherAIHandler,
  AnthropicHandler,
} from "./utils/llm.ts";
import { generatePrompt } from "./utils/prompt.ts";

const text = await Deno.readTextFile("./data/Final_FR.tsv");
const FR = Papa.parse(text, { delimiter: "\t", header: false }).data.map(
  (item: string[]) => item[0]
) as string[];

async function batchedCalls({
  model,
  batchSize = 5,
  FRStart = 0,
  FREnd = FR.length,
  sleep = 5000,
  fileName,
}: {
  model: GeminiHandler | OpenAIHandler | TogetherAIHandler;
  batchSize?: number;
  FRStart?: number;
  FREnd?: number;
  sleep?: number;
  fileName: string;
}) {
  console.log(`Starting LLM ${model.modelName}`);
  for (let i = FRStart; i < FREnd; i += batchSize) {
    console.log(`⇒ Starting batch: ${i}`);
    const batch = FR.slice(i, i + batchSize);
    const batchInputs = JSON.stringify(batch);
    const batchOutput = await model.batchQuery(batchInputs);
    Deno.writeTextFileSync(
      `./LLMOutputs/${fileName}-${i}.json`,
      JSON.stringify(
        batchOutput.map((item) => item.parsed),
        null,
        2
      )
    );
    console.log(`⇒ Sleeping for ${sleep / 1000} seconds`);
    await new Promise((resolve) => setTimeout(resolve, sleep));
  }
}

if (import.meta.main) {
  // const gemini = new GeminiHandler({
  //   apiKey: Deno.env.get("GOOGLE_API_KEY") ?? "",
  //   modelName: "gemini-1.5-pro",
  //   temperature: 0.1,
  // });

  // const openai = new OpenAIHandler({
  //   apiKey: Deno.env.get("OPENAI_API_KEY") ?? "",
  //   modelName: "gpt-4o-mini",
  //   temperature: 0.4,
  // });

  // const deepseek = new TogetherAIHandler({
  //   apiKey: Deno.env.get("TOGETH_API_KEY") ?? "",
  //   modelName: "deepseek-ai/DeepSeek-V3",
  //   temperature: 0.4,
  // });

  // const llama = new TogetherAIHandler({
  //   apiKey: Deno.env.get("TOGETH_API_KEY") ?? "",
  //   modelName: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
  //   temperature: 0.4,
  // });

  const qwen = new TogetherAIHandler({
    apiKey: Deno.env.get("TOGETH_API_KEY") ?? "",
    modelName: "Qwen/Qwen2.5-72B-Instruct-Turbo",
    temperature: 0.4,
  });

  const claude = new AnthropicHandler({
    apiKey: Deno.env.get("TOGETH_API_KEY") ?? "",
    modelName: "Qwen/Qwen2.5-72B-Instruct-Turbo",
    temperature: 0.4,
  });

  await batchedCalls({
    FRStart: 20,
    batchSize: 2,
    model: qwen,
    fileName: "Qwen2.5-72B",
  });
}
