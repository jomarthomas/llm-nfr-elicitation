# **Comparative Study of Large Language Models for Automating Non-Functional Requirements (NFR) Elicitation**

## 🚀 Project Overview

This project explores how **Large Language Models (LLMs)** can automate the **elicitation of Non-Functional Requirements (NFRs) from Functional Requirements (FRs)** to improve efficiency, coverage, and quality in software engineering.

We compare multiple **LLMs** at **three temperature settings** to assess how model variability impacts NFR quality. The project follows **ISO 25010** standards for requirement evaluation and introduces a **tailored prompting technique** for better NFR extraction.

---

## 📂 Repository Structure
- 🛠 **Preprocessing Scripts** – Prepare datasets for training and evaluation.
- 🔗 **Deno-based Pipeline** – Automates NFR generation with LLMs.
- 🎨 **Full-Stack Prototype** – **ReactJS frontend + Deno backend** for interactive NFR generation.
- 📊 **Evaluation Framework** – Uses **ISO 25010 metrics** to assess clarity, relevance, and coverage.
- 🏆 **Benchmarking Experiments** – Compares different **LLMs and temperature settings**.

---

## ⚡ Key Features

### 🔍 Automated NFR Elicitation
- Extracts **NFRs** from **FR inputs** using LLMs.
- Implements a **custom prompting technique** for better accuracy.

### 📊 LLM Benchmarking
- Evaluates different models at multiple **temperature settings**.
- Measures **accuracy, consistency, and interpretability**.

**Tested LLMs:**
  - **GPT-4**
  - **Claude**
  - **Gemini**
  - **LLaMA**
  - **DeepSeek R1**

### ✅ Evaluation Framework
- Uses **ISO 25010 quality attributes** to validate NFRs:
  - **Clarity** – Are the NFRs well-defined and unambiguous?
  - **Relevance** – Are they appropriate within the FR context?
  - **Coverage** – Do they address critical concerns?

### 🖥️ Full-Stack Prototype
- **Frontend:** Interactive **ReactJS UI** for real-time NFR generation.
- **Backend:** **Deno API** for LLM processing and storage.
- **Visualization:** Compare outputs from different models.

### ⚙️ Deno-Powered Implementation
- **Native TypeScript support** for improved type safety.
- **Built-in testing framework** for validating LLM responses.
- **Secure and modern runtime** for efficient execution.

---