import Papa from "npm:papaparse";
import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import { GeminiHandler } from "./utils/llm.ts";
import { nfrSchema } from "./utils/Promt.ts";

const text = await Deno.readTextFile("./data/FR_NFR.tsv");
const parsed = Papa.parse(text, { delimiter: "\t", header: false }).data;

const FR = parsed
  .filter((item: string[]) => item[1] === "FR")
  .map((item: string[]) => item[0]) as string[];
const randomFR = FR.sort(() => 0.5 - Math.random()).slice(0, 1)[0];

Deno.test("GeminiHandler query test", async () => {
  const handler = new GeminiHandler({
    apiKey: Deno.env.get("GOOGLE_API_KEY") ?? "",
    modelName: "gemini-1.5-flash-8b",
    temperature: 0.7,
  });

  const input = randomFR;
  const result = await handler.query(input);

  assertEquals(result.parsed, nfrSchema.parse(result.parsed));
});
