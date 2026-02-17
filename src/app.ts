import express from 'express';
import { generateProducts, generateEmbeddings, generateEmbeddingsForProducts, generateCart, uploadFile, createVector } from './openai';
import { similarProducts } from './database';
import { createReadStream } from 'node:fs';
import path from 'node:path';

const app = express();

app.use(express.json());

app.post('/generate', async (req, res) => {
    try {
        const products = await generateProducts(req.body.message);
        res.json(products);
    } catch (error) {
        console.error('Error generating products:', error);
        res.status(500).send('Error generating products');
    }
});

app.post("/cart", async (req, res) => {
    try {
        const { message } = req.body;
        const embedding = await generateEmbeddings(message);
        const products = similarProducts(embedding);
        res.json(products.map(product => ({ name: product.name, similarity: product.similarity }) ));
    } catch (error) {
        console.error('Error generating embedding:', error);
        res.status(500).send('Error generating embedding');
    }
});

app.post('/embed-products', async (req, res) => {
    try {
        await generateEmbeddingsForProducts();
        res.send('Embeddings generated successfully');
    } catch (error) {
        console.error('Error generating embeddings:', error);
        res.status(500).send('Error generating embeddings');
    }
});

app.post('/embeddings', async (req, res) => {
    try {
        const { text } = req.body;
        const embedding = await generateEmbeddings(text);
        res.json(embedding);
    } catch (error) {
        console.error('Error generating embeddings:', error);
        res.status(500).send('Error generating embeddings');
    }
});

app.post("/responses", async (req, res) => {
    try {
        const { input, instructions } = req.body;
        const response = await generateCart(input,["Arroz", "Feijão", "Macarrão", "Açúcar", "Sal", "Óleo", "Leite", "Café", "Farinha", "Biscoito", "Molho de tomate", "Atum", "Sardinha"]);
        res.json(response);
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).send('Error generating response');
    }
});

app.post('/upload', async (req, res) => {
    try {
        const file = createReadStream(path.join(__dirname, '..', 'static', 'recipes.md'));
        const response = await uploadFile(file as any);
        res.json({ fileId: response });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Error uploading file');
    }
});

app.post("/vector-store", async (req, res) => {
    try {
        await createVector();
        res.send('Vector store created successfully');
    }
    catch (error) {
        console.error('Error generating vector store response:', error);
        res.status(500).send('Error generating vector store response');
    }
});

export default app;