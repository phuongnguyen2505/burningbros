'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { getProducts } from '@/libs/api';
import { Product } from '@/types';
import ProductCard from './ProductCard';

const LOADER_LIMIT = 20;

export default function LoadMoreProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const offsetRef = useRef(LOADER_LIMIT);
    const [hasMore, setHasMore] = useState(true);

    const { ref, inView } = useInView();

    const loadMoreProducts = useCallback(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const apiProducts = await getProducts(LOADER_LIMIT, offsetRef.current);

        if (apiProducts.products.length > 0) {
            setProducts((prevProducts) => [...prevProducts, ...apiProducts.products]);
            offsetRef.current += LOADER_LIMIT;
        } else {
            setHasMore(false);
        }
    }, [setProducts, setHasMore]);

    useEffect(() => {
        if (inView && hasMore) {
            loadMoreProducts();
        }
    }, [inView, hasMore, loadMoreProducts]);

    return (
        <>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            {hasMore && (
                <div ref={ref} className="flex justify-center items-center p-4 col-span-full">
                    <p>Loading more...</p>
                </div>
            )}
        </>
    );
}