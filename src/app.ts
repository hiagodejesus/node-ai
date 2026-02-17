import express from 'express';
import { generateProducts } from './openai';

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

export default app;