# Product Transparency Report Generator

A professional **Product Transparency Report Generator** that collects structured product information through dynamic questioning and generates a detailed, well-formatted transparency report using an LLM.

---

## 🚀 Overview

This application interacts with users through a guided questionnaire—**10 dynamically generated questions**, each building on previous responses to extract accurate and relevant product details.  
Once data collection is complete, the system generates a **highly professional and comprehensive transparency report** suitable for compliance, product pages, audits, and documentation.

---

## 🧩 Tech Stack

| Component               | Technology                            |
| ----------------------- | ------------------------------------- |
| **Frontend**            | Next.js                               |
| **Backend**             | Node.js                               |
| **Database**            | MongoDB                               |
| **Authentication**      | Clerk                                 |
| **LLM**                 | Google Gemini                         |
| **Data Format for LLM** | TOON (Token Oriented Object Notation) |

---

## ✅ Key Features

- ✔ **Dynamic Question Flow**

  - 10 intelligent questions
  - Each question adapts to previous responses
  - Captures sustainability, sourcing, safety, ethics & product details

- ✔ **Professional Report Output**

  - Formal language, structured sections, industry-standard formatting
  - Designed for transparency, compliance & marketing use

- ✔ **Token-Optimized LLM Requests using TOON**

  - Custom Token Oriented Object Notation format
  - Reduces token usage while preserving context
  - Faster and cheaper LLM calls

- ✔ **User Authentication**

  - Secure login & session handling powered by Clerk

- ✔ **Modern Web UI**
  - Built with Next.js App Router
  - Responsive, fast, and user-friendly

---

## 🔧 System Architecture

```
Frontend (Next.js) → Auth (Clerk)
       ↓
Backend API (Node.js)
       ↓
MongoDB (Stores users, questions, reports)
       ↓
Gemini LLM (Report generation using TOON)
```

---

## 📁 Folder Structure

```
/frontend     → Next.js client
/backend      → Node.js APIs, LLM handler, TOON formatter
```

---

## ✅ Workflow Summary

1. User authenticates via Clerk
2. System triggers question generator
3. User answers 10 chained questions
4. Data is converted into **TOON format**
5. Gemini LLM produces the transparency report
6. Report is saved and viewable in the dashboard

---

## 🧠 Why TOON?

**TOON (Token Oriented Object Notation)**  
A custom data-packing strategy designed to:

- Minimize token count
- Maintain semantic structure
- Deliver richer context with fewer prompts
- Reduce LLM billing costs
