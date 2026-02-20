# Node AI Project

This project is a Node.js application built with Express and TypeScript that integrates with OpenAI's API to provide intelligent features for an e-commerce context, specifically focused on grocery products.

## Features

*   **Intelligent Product Suggestions**: Generates product lists based on user messages, checking stock availability using OpenAI Function Calling.
*   **Semantic Search**: Finds products similar to a user's query using Vector Embeddings and Cosine Similarity.
*   **Shopping Cart Generation**: Creates a shopping cart based on user input (e.g., a recipe or dietary need) and available products, utilizing structured outputs.
*   **Batch Processing**: Demonstrates how to use the OpenAI Batch API to generate embeddings for multiple products asynchronously.
*   **File Search & Vector Stores**: Includes endpoints to upload files and create vector stores for RAG (Retrieval-Augmented Generation) scenarios.

## Tech Stack

*   **Node.js** & **Express**: Backend framework.
*   **TypeScript**: Language.
*   **OpenAI API**:
    *   Chat Completions (`gpt-4o-mini`)
    *   Embeddings (`text-embedding-3-small`)
    *   Function Calling (Tools)
    *   Structured Outputs (Zod)
    *   Batch API
    *   Files & Vector Stores
*   **Zod**: Schema validation.

## Setup

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Create a `.env` file in the root directory and add your OpenAI API key:
    ```env
    OPENAI_API_KEY=your_api_key_here
    ```

## Running the Application

To start the server:

```bash
npm start
```

The server runs on `http://localhost:3000`.

## API Endpoints

### AI Generation & Tools
*   `POST /generate`: Generates a list of products based on a message, utilizing tools to check stock.
    *   Body: `{ "message": "I need ingredients for a cake" }`

### Embeddings & Search
*   `POST /embed-products`: Generates embeddings for all products in the in-memory database.
*   `POST /cart`: Finds similar products to the input message using embeddings.
    *   Body: `{ "message": "something sweet" }`
*   `POST /embeddings`: Generates an embedding for a specific text.
    *   Body: `{ "text": "sample text" }`

### Complex Responses
*   `POST /responses`: Generates a structured shopping cart based on input and instructions.
    *   Body: `{ "input": "Lunch for 2 people" }`

### Batch Processing
*   `POST /embeddings-batch`: Creates a batch job to generate embeddings for a list of products.
    *   Body: `{ "products": ["Product 1", "Product 2"] }`
*   `POST /embeddings-batch/results`: Checks and retrieves results for a batch ID, updating the database if complete.
    *   Body: `{ "batchId": "batch_..." }`

### Files & Vector Stores
*   `POST /upload`: Uploads a sample recipe file (`static/recipes.md`).
*   `POST /vector-store`: Creates a vector store for file search.

### Data
*   `GET /products`: Lists all products in the database.

## Project Structure

*   `src/app.ts`: Express application setup and route definitions.
*   `src/database.ts`: In-memory database and helper functions (similarity search, stock check).
*   `src/openai.ts`: OpenAI API integration logic (completions, embeddings, batching).
*   `src/index.ts`: Server entry point.