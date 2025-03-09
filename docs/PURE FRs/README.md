## Functional Requirements from PURE
To find the number of functional requirements in software project on average, we selected 15 software projects from the PURE dataset and extracted the functional requirements from them to count.

- We will be using [this](https://data.mendeley.com/datasets/4ysx9fyzv4/1) dataset that has 3964 FRs and 2153 NFRs.
- Out of the 3964, we will use [this corpus of 79 SRS documents](https://fmt.isti.cnr.it/nlreqdataset/) to select X number of FRs based on the average number of FRs in a subset of the corpus.

- We will select the SRS documents by using a subset of the criteria from [this](https://www.researchgate.net/publication/331537700_Annotation_of_Software_Requirements_Specification_SRS_Extractions_of_Nonfunctional_Requirements_and_Measurement_of_Their_Tradeoff) paper(pg. 9, section above table) and some criteria based on our use case:

  - Documents must be encoded between 2008 to 2011.
  - SRS should be in a structured or semi-structured format
  - SRS should be defining a software system
  - The resulting dataset of FRs will be used to generate NFRs