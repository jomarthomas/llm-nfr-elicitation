import Papa from "npm:papaparse";
import { GeminiHandler } from "./utils/llm.ts";
import { generatePrompt } from "./utils/prompt.ts";

if (import.meta.main) {
  const text = await Deno.readTextFile("./data/Final_FR.tsv");
  const FR = Papa.parse(text, { delimiter: "\t", header: false }).data.map(
    (item: string[]) => item[0]
  ) as string[];

  // const FR = parsed
  //   .filter((item: string[]) => item[1] === "FR")
  //   .map((item: string[]) => item[0])
  //   .slice(0, 1000) as string[];

  const gemini = new GeminiHandler({
    apiKey: Deno.env.get("GOOGLE_API_KEY") ?? "",
    modelName: "gemini-1.5-flash-8b",
    temperature: 0.4,
  });

  const inputs = JSON.stringify(FR);
  console.log(inputs)
  // Deno.writeTextFileSync(
  //   "./outputs/generatedBatch.json",
  //   JSON.stringify(
  //     (await gemini.batchQuery(inputs)).map((item) => item.parsed),
  //     null,
  //     2
  //   )
  // );

  // const randomItem = FR[Math.floor(Math.random() * FR.length)];
  // console.log((await gemini.query(randomItem)).parsed);
  // Deno.writeTextFileSync(
  //   "./outputs/generatedSingle.json",
  //   JSON.stringify((await gemini.query(randomItem)).parsed, null, 2)
  // );
}
