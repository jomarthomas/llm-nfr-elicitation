// Tests the complete pipeline using sample data.

import { generateNFRs } from "./pipeline.js";
import dotenv from "dotenv"; // Load environment variables

dotenv.config(); // Initialize dotenv to load API key

const testPipeline = async () => {
  const functionalRequirement = "The system shall process transactions within 2 seconds.";
  const context = "Online Banking System";

  try {
    const result = await generateNFRs(functionalRequirement, context);
    console.log("Generated NFRs:", result);
  } catch (error) {
    console.error("Pipeline test failed:", error.message);
  }
};

testPipeline();
