import Papa from "npm:papaparse";

export async function extractNFRs() {
  const NFRFR = await Deno.readTextFile("./data/FR_NFR.tsv");
  const FRs = (
    Papa.parse(NFRFR, { delimiter: "\t", header: false }).data as string[][]
  )
    .filter((item: string[]) => item[1] === "NFR")
    .map((item: string[]) => item[0]) as string[];
  Deno.writeTextFileSync("./data/NFR.tsv", FRs.join("\n"));
}

export async function extractFRs() {
  const NFRFR = await Deno.readTextFile("./data/FR_NFR.tsv");
  const FRs = (
    Papa.parse(NFRFR, { delimiter: "\t", header: false }).data as string[][]
  )
    .filter((item: string[]) => item[1] === "FR")
    .map((item: string[]) => item[0]) as string[];
  Deno.writeTextFileSync("./data/FR.tsv", FRs.join("\n"));
}
