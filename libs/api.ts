import { ProductsApiResponse } from '@/types';
import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export const getProducts = async (limit = 20, skip = 0): Promise<ProductsApiResponse> => {
    try {
        const response = await apiClient.get(`/products?limit=${limit}&skip=${skip}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch products:', error);
        // Trả về một object rỗng hoặc throw error để component có thể xử lý
        return { products: [], total: 0, skip: 0, limit: 0 };
    }
};