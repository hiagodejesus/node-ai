import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { ChatCompletionTool, ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { z } from 'zod';
import { productsinStock, productsOutOfStock, allProducts, setEmbeddingForProduct } from './database';

const schema = z.object({
    produtos: z.array(z.string()),
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const tools: ChatCompletionTool[] = [
    {
        type: 'function',
        function: {
            name: 'produtos_in_stock',
            description: 'Função para listar produtos disponíveis em estoque. Recebe uma lista de nomes de produtos e retorna os que estão disponíveis.',
            parameters: {
                type: 'object',
                properties: {},
            },
            strict: true
        }
    },
    {
        type: 'function',
        function: {
            name: 'produtos_out_of_stock',
            description: 'Função para listar produtos que estão fora de estoque. Recebe uma lista de nomes de produtos e retorna os que não estão disponíveis.',
            parameters: {
                type: 'object',
                properties: {},
            },
            strict: true
        }
    }
];

const generateCompletion = async (messages: ChatCompletionMessageParam[], format: any) => {
        const response = await openai.chat.completions.parse({
        model: 'gpt-4o-mini',
        max_tokens: 100,
        response_format: format,
        tools: tools,
        messages: messages,
    });

    const messageResponse = response.choices[0].message;

    if (messageResponse.refusal || !messageResponse.parsed) {
        throw new Error('No products generated');
    }

    const { tool_calls } = messageResponse;

    if (tool_calls) {
        const [tool_call] = tool_calls;

        const toolsMap = {
            produtos_in_stock: productsinStock,
            produtos_out_of_stock: productsOutOfStock,
        };

        const functionToCall = toolsMap[tool_call.function.name as keyof typeof toolsMap];

        if(!functionToCall) {
            throw new Error('Tool not found');
        }

        const result = functionToCall((tool_call.function.parsed_arguments as any).productNames || []);
        
        messages.push(messageResponse);

        messages.push({
            role: 'tool',
            tool_call_id: tool_call.id,
            content: result.toString(),
        });

        const messageWithToolResult: any = await generateCompletion(messages, zodResponseFormat(schema, 'produtos_schema'));
        return messageWithToolResult.choices[0].message.parsed;
    }
    return messageResponse;
};

export async function generateProducts(message: string): Promise<string[]> {
    const messages: ChatCompletionMessageParam[] = [
        {
            role: 'developer',
            content: 'Liste produtos que atendam a necessidade do cliente, considere o estoque disponível. Responda apenas com os produtos, sem explicações ou detalhes adicionais.',
        },
        {
            role: 'user',
            content: message,
        },
    ];

    const completion = await generateCompletion(messages, zodResponseFormat(schema, 'produtos_schema'));
    return completion.choices[0].message.parsed.produtos;
}

export const generateEmbeddings = async (text: string) => {
    try {
        const response = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: text,
            encoding_format: 'float',
        });
        return response.data[0].embedding;
    } catch (error) {
        throw new Error(`Error generating embeddings for text "${text}": ${error}`);
    }
};

export const generateEmbeddingsForProducts = async () => {
    const products = allProducts();

    await Promise.allSettled(products.map(async (product) => {
        const embedding = await generateEmbeddings(`${product.name}: ${product.description}`);
        if (!embedding) {
            console.error(`Failed to generate embedding for product: ${product.name}`);
            return;
        }
        console.log(`Produto: ${product.name}, Embedding: ${embedding}`);
        setEmbeddingForProduct(product.name, embedding);
    }));
};