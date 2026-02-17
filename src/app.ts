import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/generate', async (req: Request, res: Response) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: req.body.message
                },
            ],
        });
        res.json(completion.choices[0].message.content);
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).send('Error communicating with OpenAI');
    }
});

export default app;