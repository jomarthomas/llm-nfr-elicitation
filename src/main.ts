import Papa from "npm:papaparse";
import { GeminiHandler } from "./utils/llm.ts";

if (import.meta.main) {
  const text = await Deno.readTextFile("./data/FR_NFR.tsv");
  const parsed = Papa.parse(text, { delimiter: "\t", header: false }).data;

  const FR = parsed
    .filter((item: string[]) => item[1] === "FR")
    .map((item: string[]) => item[0]) as string[];

  // const openai = new OpenAIHandler({
  //   apiKey: Deno.env.get("OPENAI_API_KEY") ?? "",
  //   modelName: "",
  //   temperature: 1,
  // });

  // const anthropic = new AnthropicHandler({
  //   apiKey: Deno.env.get("ANTHRO_API_KEY") ?? "",
  //   modelName: "",
  //   temperature: 1,
  // });

  const gemini = new GeminiHandler({
    apiKey: Deno.env.get("GOOGLE_API_KEY") ?? "",
    modelName: "gemini-1.5-flash-8b",
    temperature: 0.7,
  });

  const generatedNFRs = [];
  const randomFRs = FR.sort(() => 0.5 - Math.random()).slice(0, 5);
  for (const fr of randomFRs) {
    generatedNFRs.push((await gemini.query(fr)).parsed);
  }

  // console.log(generatedNFRs);
  Deno.writeTextFileSync(
    "generatedNFRs.json",
    JSON.stringify(generatedNFRs, null, 2)
  );
}
