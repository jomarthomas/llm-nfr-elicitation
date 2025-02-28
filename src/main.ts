import Papa from "npm:papaparse";
import {
  GeminiHandler,
  OpenAIHandler,
  TogetherAIHandler,
  AnthropicHandler,
  GrokAIHandler,
} from "./utils/llm.ts";
import { join } from "https://deno.land/std/path/mod.ts";

// const NFRFR = await Deno.readTextFile("./data/FR_NFR.tsv");
// const FRs = (
//   Papa.parse(NFRFR, { delimiter: "\t", header: false }).data as string[][]
// )
//   .filter((item: string[]) => item[1] === "FR")
//   .map((item: string[]) => item[0]) as string[];
// Deno.writeTextFileSync("./data/FR.tsv", FRs.join("\n"));

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
  model: GeminiHandler | OpenAIHandler | TogetherAIHandler | AnthropicHandler;
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

async function combineOutputs(filePrefix: string) {
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

if (import.meta.main) {
  const fr = [
    "User shall/will be able to open various types of accounts like savings, fixed deposit, etc.",
    "The system shall allow users to add expenses with details including amount, date, payer, and optional split among participants.",
    "Faculties shall be able to upload and download assignments, college notices, student notices, journals, and videos.",
    "System shall allow users to rate and review services by providing comments on tour plans or services, with comments stored in the database and a thank you message displayed.",
    "Customers shall be able to search for new products in the database by entering item names, and upon successful search, view detailed product information.",
    "The system shall allow users to search for suggested doctors for consultation based on their symptoms or predicted diseases.",
    "User shall be able to choose payment methods such as PayPal balance, debit or credit card, and transfer funds by entering recipient's email ID or name, and making the payment.",
    "System shall automatically update the available quantity of each medicine after a sale is completed.",
    "The system shall provide a calendar view of available appointment slots for each healthcare provider",
    "User shall be able to search for properties based on specific criteria such as location, area, and number of bedrooms.",
    "System shall calculate modification charges based on modifying time, date, route, availability, display new fares, and process payments through the payment gateway.",
    "The system shall generate a PDF report of all transactions and send a copy to the customer's email address and another copy to the system database for monthly transaction calculation.",
  ];
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
  // const qwen = new TogetherAIHandler({
  //   apiKey: Deno.env.get("TOGETH_API_KEY") ?? "",
  //   modelName: "Qwen/Qwen2.5-72B-Instruct-Turbo",
  //   temperature: 0.4,
  // });
  // const claude = new AnthropicHandler({
  //   apiKey: Deno.env.get("CLAUDE_API_KEY") ?? "",
  //   modelName: "claude-3-5-haiku-20241022",
  //   temperature: 0.4,
  // });
  // const grok = new GrokAIHandler({
  //   apiKey: Deno.env.get("GROK_API_KEY") ?? "",
  //   modelName: "grok-2-1212",
  //   temperature: 0.4,
  // });
  // await batchedCalls({
  //   model: grok,
  //   batchSize: 4,
  //   fileName: "grok-2",
  // });
  // await combineOutputs("grok-2");
}
