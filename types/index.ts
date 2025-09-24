export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}

export interface ProductsApiResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    image: string;
    address?: {
        address?: string;
        city?: string;
        postalCode?: string;
    };
}

export interface AuthCredentials {
    username?: string;
    password?: string;
}

export interface AuthResponse extends User {
    token: string;
}