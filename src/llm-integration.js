// Manages API calls to the LLM for generating NFRs.

import OpenAI from "openai"; // Import OpenAI SDK
import dotenv from "dotenv"; // Load environment variables

dotenv.config(); // Initialize dotenv to load environment variables

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use API key from environment variable
});

// Query LLM using OpenAI SDK
const queryLLM = async (prompt) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Use the specified model
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    // Return the content of the response
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error querying LLM:", error.message);
    throw error;
  }
};

export default queryLLM;
