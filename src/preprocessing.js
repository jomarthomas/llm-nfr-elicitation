export const cleanAndTokenizeFR = (functionalRequirement) => {
    // Remove unnecessary details and format FR
    const cleanedFR = functionalRequirement.replace(/[^a-zA-Z0-9\s.,]/g, '').trim();
  
    // Tokenize into manageable chunks (if required)
    const tokens = cleanedFR.split(' ');
    return tokens.join(' ').substring(0, 2048); // Example token limit handling
  };
  
  export const prepareInputForLLM = (functionalRequirement, context = "") => {
    return {
      FunctionalRequirement: cleanAndTokenizeFR(functionalRequirement),
      Context: context,
    };
  };  