import Papa from "npm:papaparse";
import {
  GeminiHandler,
  OpenAIHandler,
  TogetherAIHandler,
} from "./utils/llm.ts";
import { generatePrompt } from "./utils/prompt.ts";

if (import.meta.main) {
  const text = await Deno.readTextFile("./data/Final_FR.tsv");
  const FR = Papa.parse(text, { delimiter: "\t", header: false }).data.map(
    (item: string[]) => item[0]
  ) as string[];

  // const gemini = new GeminiHandler({
  //   apiKey: Deno.env.get("GOOGLE_API_KEY") ?? "",
  //   modelName: "gemini-1.5-pro",
  //   temperature: 0.1,
  // });

  // const inputs = JSON.stringify(FR);
  // Deno.writeTextFileSync(
  //   "./LLMOutputs/gemini-1.5-pro/temp0.4.json",
  //   JSON.stringify(
  //     (await gemini.batchQuery(inputs)).map((item) => item.parsed),
  //     null,
  //     2
  //   )
  // );

  // const openai = new OpenAIHandler({
  //   apiKey: Deno.env.get("OPENAI_API_KEY") ?? "",
  //   modelName: "gpt-4o-mini",
  //   temperature: 0.4,
  // });

  // const inputs = JSON.stringify(FR);
  // // console.log(await openai.query(inputs))
  // const output = await openai.batchQuery(inputs);
  // console.log(output);
  // Deno.writeTextFileSync(
  //   "./LLMOutputs/gpt-4o-mini.json",
  //   JSON.stringify(
  //     output.map((item) => item.parsed),
  //     null,
  //     2
  //   )
  // );

  // const deepseek = new TogetherAIHandler({
  //   apiKey: Deno.env.get("TOGETH_API_KEY") ?? "",
  //   modelName: "deepseek-ai/DeepSeek-V3",
  //   temperature: 0.4,
  // });

  // for (let i = 20; i < FR.length; i += 5) {
  //   console.log(`Starting batch: ${i}`);
  //   const batch = FR.slice(i, i + 5);
  //   const batchInputs = JSON.stringify(batch);
  //   const batchOutput = await deepseek.batchQuery(batchInputs);
  //   console.log(batchOutput);
  //   Deno.writeTextFileSync(
  //     `./LLMOutputs/DeepSeek-V3-${i}.json`,
  //     JSON.stringify(
  //       batchOutput.map((item) => item.parsed),
  //       null,
  //       2
  //     )
  //   );
  //   console.log("Sleeping for 5 seconds");
  //   await new Promise((resolve) => setTimeout(resolve, 5000));
  // }

  // meta-llama/Llama-3.3-70B-Instruct-Turbo-Free
  // const llama = new TogetherAIHandler({
  //   apiKey: Deno.env.get("TOGETH_API_KEY") ?? "",
  //   modelName: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
  //   temperature: 0.4,
  // });

  // for (let i = 0; i < FR.length; i += 5) {
  //   console.log(`Starting batch: ${i}`);
  //   const batch = FR.slice(i, i + 5);
  //   const batchInputs = JSON.stringify(batch);
  //   const batchOutput = await llama.batchQuery(batchInputs);
  //   console.log(batchOutput);
  //   Deno.writeTextFileSync(
  //     `./LLMOutputs/lama-3.3-70B-${i}.json`,
  //     JSON.stringify(
  //       batchOutput.map((item) => item.parsed),
  //       null,
  //       2
  //     )
  //   );
  //   console.log("Sleeping for 5 seconds");
  //   await new Promise((resolve) => setTimeout(resolve, 5000));
  // }

  const qwen = new TogetherAIHandler({
    apiKey: Deno.env.get("TOGETH_API_KEY") ?? "",
    modelName: "Qwen/Qwen2.5-72B-Instruct-Turbo",
    temperature: 0.4,
  });

  for (let i = 20; i < FR.length; i += 5) {
    console.log(`Starting batch: ${i}`);
    const batch = FR.slice(i, i + 5);
    const batchInputs = JSON.stringify(batch);
    const batchOutput = await qwen.batchQuery(batchInputs);
    console.log(batchOutput);
    Deno.writeTextFileSync(
      `./LLMOutputs/Qwen2.5-72B-${i}.json`,
      JSON.stringify(
        batchOutput.map((item) => item.parsed),
        null,
        2
      )
    );
    console.log("Sleeping for 5 seconds");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}
