import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';

dotenv.config();

const app = express();

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const schema = z.object({
    produtos: z.array(z.string()),
})

app.post('/generate', async (req: Request, res: Response) => {
    try {
        const completion = await openai.chat.completions.parse({
            model: "gpt-4o-mini",
            max_completion_tokens: 100,
            response_format: zodResponseFormat(schema, "produtos_schema"),
            messages: [
                {
                    role: "developer",
                    content: "You are a nutritionist. Recommend products for a diet!",
                },
                {
                    role: "user",
                    content: req.body.message
                },
            ],
        });

        res.json(completion.choices[0].message.parsed?.produtos);

    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).send('Error communicating with OpenAI');
    }
});

export default app;