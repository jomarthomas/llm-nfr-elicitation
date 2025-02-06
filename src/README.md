## Local development

### Install [Deno](https://deno.com/)

We chose Deno to make the development process smoother using various in-built features such as native Typescript support, built-in testing suit and other security features.

```sh
# MacOS
curl -fsSL https://deno.land/install.sh | sh
```

```sh
# Windows
irm https://deno.land/install.ps1 | iex
```

```sh
# Linux
curl -fsSL https://deno.land/install.sh | sh
```

_Note: Some times, the installation is OS dependent so please take a look at the official [installation guide](https://docs.deno.com/runtime/getting_started/installation/)._

### Running the code

The code for the paper is set up in the `src` directory of the root of the repo. When you clone the project, and open the repo in an IDE such as vscode, you will have to `cd` into the `src` directory through the terminal first.

`src/main.ts` is the entry point of the project. Due to [security concerns](https://docs.deno.com/runtime/fundamentals/security/), Deno requires command line flags in order to allow scripts to make network calls, reading files, etc so you can use `src/deno.json` to define tasks to run scripts.

To run the program with all the necessary flags, use this command.

```sh
deno task run
```

### Data sources

All the data required to run the program will be included in the `src/data` directory.

- `FR_NFR.tsv`: This is a labeled list of NFRs and FRs. [Original source](https://data.mendeley.com/datasets/4ysx9fyzv4/1) is available in `.xlsx` format but after a round of data cleansing, which removed all empty values and un-wanted columns, `.xlsx` is exported as `.tsv` to make it easier to ingest through the pipeline. Using [Papaparse](https://www.papaparse.com/), we import the `.tsv` and filter NFRs and FRs into a list of strings.
- Maybe https://github.com/poonkuzhali/LLMs_RequirementsClassification?tab=readme-ov-file

### Env Variables
#### How to get a google API key: [Refer this](https://ai.google.dev/gemini-api/docs/api-key)

- Make a new file `.env.dev` in the `./src` directory.
- Add the keys from `.env.sample` file to the new file
- Update the keys with the actual API key value.

## TODO

- [x] A new prompt with iso to extract NFRs

## Questions
- [ ] Whats the aim? why do we need frontend
  - Optional if we need to make it as a separate product
- [ ] How do we validate/ benchmark results NFRs/ What is the baseline dataset:
  - Use SRS ISO ISO/IEC/IEEE 29148:2018
  - Manual approach to industry experts using a survey of sorts
  - Use LLM to validate the results
  - Try to quantize the generated NFRs based on FR
- [ ] Any time line for the project/ any particular conference that we're aiming for: https://conf.researchr.org/home/RE-2025