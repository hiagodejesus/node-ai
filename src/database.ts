const products: {
    id: number;
    name: string;
    stock: number;
    description: string;
    embedding?: number[];
}[] = [
    { id: 1, name: "Arroz", stock: 100, description: "Arroz branco tipo 1" },
    { id: 2, name: "Feijão", stock: 50, description: "Feijão carioca" },
    { id: 3, name: "Macarrão", stock: 75, description: "Macarrão parafuso" },
    { id: 4, name: "Açúcar", stock: 200, description: "Açúcar refinado" },
    { id: 5, name: "Sal", stock: 120, description: "Sal grosso" },
    { id: 6, name: "Óleo", stock: 80, description: "Óleo de soja" },
    { id: 7, name: "Leite", stock: 60, description: "Leite integral" },
    { id: 8, name: "Café", stock: 90, description: "Café torrado e moído" },
    { id: 9, name: "Farinha", stock: 110, description: "Farinha de trigo" },
    { id: 10, name: "Biscoito", stock: 150, description: "Biscoito de chocolate" },
    { id: 11, name: "Molho de tomate", stock: 40, description: "Molho de tomate industrial" },
    { id: 12, name: "Atum", stock: 35, description: "Atum em lata" },
    { id: 13, name: "Sardinha", stock: 45, description: "Sardinha em lata" },
];

export const productsinStock = (productNames: string[]) => {
    return products.filter(product => productNames.includes(product.name)).map(product => product.name);
};

export const productsOutOfStock = (productNames: string[]) => {
    return products.filter(product => !productNames.includes(product.name) || product.stock === 0).map(product => product.name);
};

export const allProducts = () => [...products];

export const setEmbeddingForProduct = (productId: number, embedding: number[]) => {
    const product = products.find(p => p.id === productId);
    if (product) {
        product.embedding = embedding;
    }
};

function cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

export const similarProducts = (embedding: number[]) => {
    return products.filter(product => product.embedding).map(product => ({
        ...product,
        similarity: cosineSimilarity(product.embedding!, embedding!)
    })).sort((a, b) => b.similarity - a.similarity).slice(0, 5);
};
