const products: {
    name: string;
    stock: number;
}[] = [
    { name: "Arroz", stock: 100 },
    { name: "Feijão", stock: 50 },
    { name: "Macarrão", stock: 75 },
    { name: "Açúcar", stock: 200 },
    { name: "Sal", stock: 120 },
    { name: "Óleo", stock: 80 },
    { name: "Leite", stock: 60 },
    { name: "Café", stock: 90 },
    { name: "Farinha", stock: 110 },
    { name: "Biscoito", stock: 150 },
    { name: "Molho de tomate", stock: 40 },
    { name: "Atum", stock: 35 },
    { name: "Sardinha", stock: 45 },
];

export const productsinStock = (productNames: string[]) => {
    return products.filter(product => productNames.includes(product.name)).map(product => product.name);
};

export const productsOutOfStock = (productNames: string[]) => {
    return products.filter(product => !productNames.includes(product.name) || product.stock === 0).map(product => product.name);
};
