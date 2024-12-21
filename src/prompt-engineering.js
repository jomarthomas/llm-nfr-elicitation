// Defines and manages the prompts used for querying the LLM.

export const generateBasicPrompt = (functionalRequirement) => {
  return `Given the following Functional Requirement, list potential Non-Functional Requirements (e.g., performance, security, usability):\n\n${functionalRequirement}. Do not use introductory and closing boilerplate text`;
};

export const generateContextSpecificPrompt = (functionalRequirement, context) => {
  return `For a ${context} application, what are the relevant Non-Functional Requirements for the following Functional Requirement?\n\n${functionalRequirement}. Do not use introductory and closing boilerplate text`;
};
