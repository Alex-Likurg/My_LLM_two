# 🧠 My_LLM_two: Fine-Tuning a Pretrained Language Model

This project focuses on fine-tuning an existing large language model (LLM) using domain-specific text data extracted from a connected database.

---

## 📌 Features

- 🔗 Connects to an existing database to extract relevant text
- 📝 Converts extracted text into structured JSON
- 🔣 Tokenizes and processes input into machine-readable format
- 🧑‍🏫 Fine-tunes a pretrained LLM using the prepared dataset
- 🧩 Combines TypeScript backend with Python training logic

---

## 🛠️ Tech Stack

- **Languages:** TypeScript, Python
- **Data Handling:** PostgreSQL (or compatible), JSON
- **ML Tools:** Hugging Face Transformers, PyTorch
- **Tokenization & Preprocessing:** Custom scripts in TypeScript & Python

---

## 🚀 Project Workflow

### 1. Connect to Database

Files: `server.ts`, `connect_to_database.ts`  
These scripts establish a connection and prepare text data for further processing.

### 2. Generate JSON Data

File: `data.ts`  
Extracts and formats text into a structured `.json` format suitable for tokenization.

### 3. Tokenize & Prepare Dataset

Files: `process_input.py`, `dataset.ts`  
Tokenizes the data and prepares a dataset ready for training.

### 4. Fine-Tune the Model

File: `trainer.py`  
Loads a pretrained language model and fine-tunes it on the prepared dataset.

---

## 📁 Project Structure

```
My_LLM_two/
├── server.ts               # Connects to the database
├── connect_to_database.ts # DB connection utility
├── data.ts                 # Extracts and formats text as JSON
├── dataset.ts              # Prepares dataset for training
├── process_input.py        # Tokenization logic
├── trainer.py              # Model fine-tuning script
└── README.md
```

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).
