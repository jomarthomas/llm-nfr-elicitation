import fs from "fs"; // File system module
import { generateNFRs } from "./pipeline.js"; // Import the pipeline

// Read and parse the JSON file
const readRequirementsFromFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data); // Parse JSON data
  } catch (error) {
    console.error("Error reading the JSON file:", error.message);
    throw error;
  }
};

// Write results to an output JSON file
const writeResultsToFile = (filePath, results) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
    console.log(`Generated NFRs saved to: ${filePath}`);
  } catch (error) {
    console.error("Error writing to JSON file:", error.message);
    throw error;
  }
};

// Process each requirement
const processRequirements = async (inputFilePath, outputFilePath) => {
  const requirements = readRequirementsFromFile(inputFilePath);
  const results = [];

  for (const req of requirements) {
    console.log(`Processing Requirement ID: ${req.id}`);
    try {
      const result = await generateNFRs(req.requirement, req.context);
      results.push({ id: req.id, requirement: req.requirement, context: req.context, nfrs: result });
    } catch (error) {
      console.error(`Error processing Requirement ID ${req.id}:`, error.message);
      results.push({ id: req.id, error: error.message });
    }
  }

  // Write all results to the output file
  writeResultsToFile(outputFilePath, results);
};

// Specify the JSON file paths
const inputFilePath = "./reqview_requirements.json";
const outputFilePath = "./generated_nfrs.json";

// Start processing
processRequirements(inputFilePath, outputFilePath);