import Papa from "npm:papaparse";
// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const text = await Deno.readTextFile("./data/FR_NFR.tsv");
  const parsed = Papa.parse(text, { delimiter: "\t", header: false }).data;
  const NFR = parsed
    .filter((item: string[]) => item[1] === "NFR")
    .map((item: string[]) => item[0]) as string[];
  const FR = parsed
    .filter((item: string[]) => item[1] === "FR")
    .map((item: string[]) => item[0]) as string[]; 
}
