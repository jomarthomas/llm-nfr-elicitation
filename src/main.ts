import Papa from "npm:papaparse";
import { GeminiHandler, OpenAIHandler, TogetherAIHandler } from "./utils/llm.ts";
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

  const deepseek = new TogetherAIHandler({
    apiKey: Deno.env.get("TOGETH_API_KEY") ?? "",
    modelName: "deepseek-ai/DeepSeek-R1",
    temperature: 0.4,
  });

  const inputs = JSON.stringify(FR);
  console.log(await deepseek.query(inputs))
  // const output = await deepseek.batchQuery(inputs);
  // console.log(output);
  // Deno.writeTextFileSync(
  //   "./LLMOutputs/DeepSeek-R1.json",
  //   JSON.stringify(
  //     output.map((item) => item.parsed),
  //     null,
  //     2
  //   )
  // );
}
