export const refineNFRs = (nfrs) => {
  // Remove duplicates and irrelevant entries
  const uniqueNFRs = [...new Set(nfrs)].filter((nfr) => nfr.length > 3);

  // Categorize NFRs
  const categories = {
    Security: uniqueNFRs.filter((nfr) => nfr.toLowerCase().includes("security")),
    Performance: uniqueNFRs.filter((nfr) => nfr.toLowerCase().includes("performance")),
    Usability: uniqueNFRs.filter((nfr) => nfr.toLowerCase().includes("usability")),
    Scalability: uniqueNFRs.filter((nfr) => nfr.toLowerCase().includes("scalability")),
  };

  return { uniqueNFRs, categories };
};