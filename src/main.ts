import Papa from "npm:papaparse";
import { GeminiHandler } from "./utils/llm.ts";
import { generatePrompt } from "./utils/prompt.ts";

if (import.meta.main) {
  const text = await Deno.readTextFile("./data/FR_NFR.tsv");
  const parsed = Papa.parse(text, { delimiter: "\t", header: false }).data;

  const FR = parsed
    .filter((item: string[]) => item[1] === "FR")
    .map((item: string[]) => item[0])
    .slice(0, 1000) as string[];

  const gemini = new GeminiHandler({
    apiKey: Deno.env.get("GOOGLE_API_KEY") ?? "",
    modelName: "gemini-1.5-flash-8b",
    temperature: 0.4,
  });

  const generatedNFRs = [];
  for (let i = 0; i < FR.length; i += 100) {
    const inputs = JSON.stringify(FR.slice(i, i + 100));
    generatedNFRs.push(...(await gemini.batchQuery(inputs)));
    Deno.writeTextFileSync(
      "generatedBatchNFRs.json",
      JSON.stringify(generatedNFRs, null, 2)
    );
    break;
  }

  const randomFRs = FR.sort(() => 0.5 - Math.random()).slice(0, 5);
  // for (const fr of randomFRs) {
  //   generatedNFRs.push((await gemini.query(fr)).parsed);
  // }

  // console.log(generatedNFRs);
}
