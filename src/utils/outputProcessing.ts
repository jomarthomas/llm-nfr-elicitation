import {
  GeminiHandler,
  OpenAIHandler,
  TogetherAIHandler,
  AnthropicHandler,
  GrokAIHandler,
} from "./llms/index.ts";
import Papa from "npm:papaparse";
import { join } from "https://deno.land/std/path/mod.ts";

const text = await Deno.readTextFile("./data/FR_34.tsv");
const FR = Papa.parse(text, { delimiter: "\t", header: false }).data.map(
  (item: string[]) => item[0]
) as string[];


export async function batchedCalls({
  model,
  batchSize = 5,
  FRStart = 0,
  FREnd = FR.length,
  sleep = 5000,
  fileName,
}: {
  model:
    | GeminiHandler
    | OpenAIHandler
    | TogetherAIHandler
    | AnthropicHandler
    | GrokAIHandler;
  batchSize?: number;
  FRStart?: number;
  FREnd?: number;
  sleep?: number;
  fileName: string;
}) {
  console.log(`Starting LLM ${model.modelName}`);
  // We are batching these calls because some models like Gemini can
  // process all the 34 NFRs along with the long, advanced prompt in one go
  // but other models quickly hits the ceiling and crashes after 8 minutes
  // while also using up the credits. So its better we chunk the NFRs
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

export async function combineOutputs(filePrefix: string) {
  const dir = "./LLMOutputs";
  const files = [];
  for await (const dirEntry of Deno.readDir(dir)) {
    if (dirEntry.isFile && dirEntry.name.startsWith(filePrefix)) {
      files.push(dirEntry.name);
    }
  }
  files.sort((a, b) => {
    const getNumber = (fileName: string) => {
      const match = fileName.match(/-(\d+)\.json$/);
      return match ? parseInt(match[1], 10) : 0;
    };
    return getNumber(a) - getNumber(b);
  });
  const combinedOutput = [];
  for await (const file of files) {
    const content = await Deno.readTextFile(join(dir, file));
    const jsonContent = JSON.parse(content);
    combinedOutput.push(...jsonContent);
  }

  await Deno.writeTextFile(
    join(dir, `${filePrefix}.json`),
    JSON.stringify(combinedOutput, null, 2)
  );
}
