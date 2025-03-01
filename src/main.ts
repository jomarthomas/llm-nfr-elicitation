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

// async function replaceOldFRs() {
//   const models = [
//     "grok-2",
//     "gpt-4o-mini",
//     "Qwen2.5-72B",
//     "gpt-4o-mini",
//     "deepSeek-V3",
//     "claude-3-7-sonnet",
//     "lama-3.3-70B",
//   ];

//   const fr = [
//     {
//       old: "The system shall generate reports on storage consumption by financial contact.",
//       new: "User shall/will be able to open various types of accounts like savings, fixed deposit, etc.",
//     },
//     {
//       old: "The system shall be able to generate a series of multiple-choice fraction questions that form a cohesive storyline to introduce a specific topic.",
//       new: "The system shall allow users to add expenses with details including amount, date, payer, and optional split among participants.",
//     },
//     {
//       old: "System shall read initialization data to derive definitions of heating and cooling units.",
//       new: "Faculties shall be able to upload and download assignments, college notices, student notices, journals, and videos.",
//     },
//     {
//       old: "System shall set over temperature values to prevent temperature deviations beyond 3 degrees Fahrenheit.",
//       new: "System shall allow users to rate and review services by providing comments on tour plans or services, with comments stored in the database and a thank you message displayed.",
//     },
//     {
//       old: "System shall show the first lines of news articles based on the titles on the title screen.",
//       new: "Customers shall be able to search for new products in the database by entering item names, and upon successful search, view detailed product information.",
//     },
//     {
//       old: "User shall be able to sign up and validate credentials, leading to access to the Snap camera screen.",
//       new: "The system shall allow users to search for suggested doctors for consultation based on their symptoms or predicted diseases.",
//     },
//     {
//       old: "The system shall allow prospective applicants to research requirements and select relevant services or applications to initiate online.",
//       new: "User shall be able to choose payment methods such as PayPal balance, debit or credit card, and transfer funds by entering recipient's email ID or name, and making the payment.",
//     },
//     {
//       old: "System shall ensure that dataset instances of a type created during app deployment start using the new code when a new version of the dataset type is deployed.",
//       new: "System shall automatically update the available quantity of each medicine after a sale is completed.",
//     },
//     {
//       old: "User shall be able to create a Gmail account by providing personal details like name, gender, password, mobile number, and location.",
//       new: "The system shall provide a calendar view of available appointment slots for each healthcare provider",
//     },
//     {
//       old: "A surface app page shall provide a customer with all customer system functionality.",
//       new: "User shall be able to search for properties based on specific criteria such as location, area, and number of bedrooms.",
//     },
//     {
//       old: 'If the validation fails, system shall prompt "Wrong OTP".',
//       new: "System shall calculate modification charges based on modifying time, date, route, availability, display new fares, and process payments through the payment gateway.",
//     },
//     {
//       old: "Information on remaining job posting time and CV access shall be reportable",
//       new: "The system shall generate a PDF report of all transactions and send a copy to the customer's email address and another copy to the system database for monthly transaction calculation.",
//     },
//   ];

//   for (const model in models) {
//     const main = JSON.parse(
//       await Deno.readTextFile(`./LLMOutputs/${models[model]}.json`)
//     ) as {
//       functionalRequirement: string;
//       identifiedNFRs: {
//         attribute: string;
//         requirement: string;
//         justification: string;
//       }[];
//     }[];
//     const updated = JSON.parse(
//       await Deno.readTextFile(`./LLMOutputs/${models[model]}-u.json`)
//     ) as {
//       functionalRequirement: string;
//       identifiedNFRs: {
//         attribute: string;
//         requirement: string;
//         justification: string;
//       }[];
//     }[];

//     const merge = [...main, ...updated];
//     let count = 0;

//     fr.forEach((i) => {
//       const toDel = main.find((item) => item.functionalRequirement === i.old);
//       if (toDel) {
//         const index = merge.indexOf(toDel);
//         if (index > -1) {
//           count++;
//           merge.splice(index, 1);
//         }
//       } else {
//         console.log(i.old);
//       }
//     });

//     console.log(models[model], count);

//     await Deno.writeTextFile(
//       `./LLMOutputs/${models[model]}.json`,
//       JSON.stringify(merge, null, 2)
//     );
//   }
// }

if (import.meta.main) {
  // const gemini = new GeminiHandler({
  //   apiKey: Deno.env.get("GOOGLE_API_KEY") ?? "",
  //   modelName: "gemini-1.5-pro",
  //   temperature: 0.4,
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
  // const claude37 = new AnthropicHandler({
  //   apiKey: Deno.env.get("CLAUDE_API_KEY") ?? "",
  //   modelName: "claude-3-7-sonnet-20250219",
  //   temperature: 0.4,
  // });
  // const grok = new GrokAIHandler({
  //   apiKey: Deno.env.get("GROK_API_KEY") ?? "",
  //   modelName: "grok-2-1212",
  //   temperature: 0.4,
  // });
  // const claude35 = new AnthropicHandler({
  //   apiKey: Deno.env.get("CLAUDE_API_KEY") ?? "",
  //   modelName: "claude-3-5-haiku-20241022",
  //   temperature: 0.4,
  // });

  // const reqs = Promise.all([
  //   await batchedCalls({
  //     model: claude37,
  //     batchSize: 2,
  //     fileName: "claude-3-7-haiku-u",
  //   }).then(async () => {
  //     await combineOutputs("claude-3-7-haiku-u");
  //   }),
  //   await batchedCalls({
  //     model: deepseek,
  //     batchSize: 2,
  //     fileName: "deepSeek-V3-u",
  //   }).then(async () => {
  //     await combineOutputs("deepSeek-V3-u");
  //   }),
  //   await batchedCalls({
  //     model: openai,
  //     batchSize: 2,
  //     fileName: "gpt-4o-mini-u",
  //   }).then(async () => {
  //     await combineOutputs("gpt-4o-mini-u");
  //   }),
  //   await batchedCalls({
  //     model: grok,
  //     batchSize: 2,
  //     fileName: "grok-2-u",
  //   }).then(async () => {
  //     await combineOutputs("grok-2-u");
  //   }),
  //   await batchedCalls({
  //     model: llama,
  //     batchSize: 2,
  //     fileName: "lama-3.3-70B-u",
  //   }).then(async () => {
  //     await combineOutputs("lama-3.3-70B-u");
  //   }),
  //   await batchedCalls({
  //     model: qwen,
  //     batchSize: 2,
  //     fileName: "Qwen2.5-72B-u",
  //   }).then(async () => {
  //     await combineOutputs("Qwen2.5-72B-u");
  //   }),
  // ]);
}
