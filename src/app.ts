import express from 'express';
import { generateProducts, generateEmbeddings, generateEmbeddingsForProducts,  } from './openai';
import { similarProducts, allProducts } from './database';

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

export default app;