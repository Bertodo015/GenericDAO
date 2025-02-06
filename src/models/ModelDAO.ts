export type User = {
    id: number,
    name: string,
    email: string,
    age: number
};

export type Product = {
    id: number,
    name: string,
    price: number,
    stock: number
};

export type Order = {
    id: number,
    userId: number,
    productId: number,
    quantity: number,
    total: number
};