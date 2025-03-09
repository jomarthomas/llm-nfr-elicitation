import { DB } from "https://deno.land/x/sqlite/mod.ts";

// Assignments for NFR evaluation (validity/applicability)
const nfrAssignments = {
  santhosh: { FR: [25, 12, 23], model: "grok-2" },
  jomar: { FR: [7, 20, 9], model: "gpt-4o-mini" },
  sanjay: { FR: [34, 3, 11], model: "Qwen2.5-72B" },
  alejandra: { FR: [29, 17, 10], model: "gemini-1.5-pro" },
  yang: { FR: [8, 32, 14], model: "gpt-4o-mini" },
  stephanie: { FR: [4, 13, 18], model: "claude-3-5-haiku" },
  aadil: { FR: [21, 27, 6], model: "claude-3-5-haiku" },
  ariela: { FR: [24, 15, 19], model: "deepSeek-V3" },
  diana: { FR: [2, 28, 26], model: "claude-3-7-sonnet" },
  felix: { FR: [30, 22, 16], model: "lama-3.3-70B" },
};

// Assignments for attribute evaluation (humanAttr)
const attrAssignments = {
  santhosh: { FR: [1, 5, 31] },
  jomar: { FR: [33, 19, 15] },
  sanjay: { FR: [8, 24, 30] },
  alejandra: { FR: [6, 14, 27] },
  yang: { FR: [11, 16, 22] },
  stephanie: { FR: [9, 25, 28] },
  aadil: { FR: [12, 18, 32] },
  ariela: { FR: [2, 7, 20] },
  diana: { FR: [4, 10, 23] },
  felix: { FR: [3, 13, 26] },
};

// Attributes for humanAttr
const attributes = [
  "Functional Suitability",
  "Performance Efficiency",
  "Compatibility",
  "Usability",
  "Reliability",
  "Security",
  "Maintainability",
  "Flexibility",
  "Safety",
];

async function createDumpDb() {
  // Read SQL dump file
  const sqlDump = await Deno.readTextFile("analysis/syntheticData/dump.sql");

  // Create a new SQLite database
  const newDb = new DB("analysis/syntheticData/dump.db");

  // Execute SQL dump
  newDb.execute(sqlDump);

  // Close the new database
  newDb.close();
  console.log("Database created from dump.sql and saved to dump.db");
}

async function generateCSV() {
  // Open database
  const db = new DB("analysis/syntheticData/dump.db");

  // Interface for FRWithNFRs
  interface FRWithNFRs {
    id: number;
    functionalRequirement: string;
    identifiedNFRs: {
      id: string;
      attribute:
        | "Functional Suitability"
        | "Performance Efficiency"
        | "Compatibility"
        | "Usability"
        | "Reliability"
        | "Security"
        | "Maintainability"
        | "Flexibility"
        | "Safety";
      requirement: string;
      justification: string;
      validity?: number;
      applicability?: number;
      humanAttr?: string;
      llm?: string;
      assignedFor?: "nfr" | "attr";
      user?: string;
      nfrUser?: string;
      attrUser?: string;
    }[];
  }

  // Function to fetch NFRs
  function fetchNFRs(frIds: number[], llm?: string): FRWithNFRs[] {
    const placeholders = frIds.map(() => "?").join(",");
    let query = `
    SELECT f.id, f.requirement AS fr_requirement,
           n.id AS nfr_id, n.attribute, n.requirement AS nfr_requirement,
           n.justification, n.llm, n.applicability, n.validity, n.nfrUser, n.humanAttr, n.attrUser
    FROM frs f
    LEFT JOIN nfrs n ON f.id = n.fr_id
    WHERE f.id IN (${placeholders})
  `;
    const params: any[] = frIds;
    if (llm) {
      query += " AND n.llm = ?";
      params.push(llm);
    }

    const result = db.query(query, params);
    const frMap: { [key: number]: FRWithNFRs } = {};

    for (const row of result) {
      // console.log(row);
      const [
        frId,
        frReq,
        nfrId,
        attr,
        nfrReq,
        just,
        llm,
        applicability,
        validity,
        nfrUser,
        humanAttr,
        attrUser,
      ] = row as [
        number,
        string,
        string | null,
        string | null,
        string | null,
        string | null,
        string | null,
        number,
        number,
        string | null,
        string | null,
        string | null
      ];
      if (!frMap[frId]) {
        frMap[frId] = {
          id: frId,
          functionalRequirement: frReq,
          identifiedNFRs: [],
        };
      }
      if (nfrId) {
        frMap[frId].identifiedNFRs.push({
          id: nfrId,
          attribute: attr as any,
          requirement: nfrReq!,
          justification: just!,
          applicability,
          validity,
          nfrUser: nfrUser!,
          humanAttr: humanAttr!,
          attrUser: attrUser!,
          llm: llm!,
        });
      }
    }
    return Object.values(frMap);
  }

  // Process NFR assignments
  const nfrData: FRWithNFRs[] = [];
  for (const [user, { FR, model }] of Object.entries(nfrAssignments)) {
    const frsWithNfrs = fetchNFRs(FR, model);
    frsWithNfrs.forEach((fr) => {
      fr.identifiedNFRs.forEach((nfr) => {
        // console.log(nfr);
        // nfr.validity = nfr.validity;
        // nfr.applicability = nfr.applicability;
        nfr.assignedFor = "nfr";
        nfr.user = user;
      });
      nfrData.push(fr);
    });
  }

  // Process attribute assignments
  const attrData: FRWithNFRs[] = [];
  for (const [user, { FR }] of Object.entries(attrAssignments)) {
    const frsWithNfrs = fetchNFRs(FR);
    frsWithNfrs.forEach((fr) => {
      fr.identifiedNFRs.forEach((nfr) => {
        // nfr.humanAttr = attributes[Math.floor(Math.random() * attributes.length)];
        // nfr.humanAttr = nfr.humanAttr;
        nfr.assignedFor = "attr";
        nfr.user = user;
      });
      attrData.push(fr);
    });
  }

  // Combine data
  const allData = [...nfrData, ...attrData];

  // Flatten for CSV
  const csvRows = [
    "fr_id,fr_requirement,nfr_id,llm,attribute,requirement,justification,validity,applicability,humanAttr,assignedFor,user",
  ];
  for (const fr of allData) {
    for (const nfr of fr.identifiedNFRs) {
      const row = [
        fr.id,
        `"${fr.functionalRequirement.replace(/"/g, '""')}"`,
        nfr.id,
        nfr.llm || "",
        nfr.attribute,
        `"${nfr.requirement.replace(/"/g, '""')}"`,
        `"${nfr.justification.replace(/"/g, '""')}"`,
        nfr.validity || "",
        nfr.applicability || "",
        nfr.humanAttr || "",
        nfr.assignedFor || "",
        nfr.user || "",
      ].join(",");
      csvRows.push(row);
    }
  }

  // Write to CSV
  Deno.writeTextFileSync(
    "analysis/syntheticData/dump_nfr_data.csv",
    csvRows.join("\n")
  );

  // Close database
  db.close();

  console.log("Synthetic dataset saved to synthetic_nfr_data.csv");
}

await createDumpDb();
await generateCSV();
