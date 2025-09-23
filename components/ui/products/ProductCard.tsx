'use client';

import { Product } from '@/types';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import { useCartStore } from '@/store/cartStore';
import { useAnimation, useModal } from '@/context/AppProviders';
import { useRef } from 'react';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const imageRef = useRef<HTMLDivElement | null>(null);
    const { triggerAnimation } = useAnimation();
    const addItem = useCartStore((state) => state.addItem);
    const { openModal } = useModal();

    const handleAddToCart = () => {
        if (imageRef.current) {
            const rect = imageRef.current.getBoundingClientRect();
            triggerAnimation({
                imageSrc: product.thumbnail,
                startRect: rect,
            });
        }

        setTimeout(() => {
            addItem(product);
            openModal({
                title: 'Success!',
                message: `${product.title} has been added to your cart.`,
                confirmText: 'Great!',
            });
        }, 500);
    };

    return (
        <div>
            <div
                ref={imageRef}
                className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7"
            >
                <Image
                    src={product.thumbnail}
                    alt={product.title}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                />
            </div>
            <h3 className="mt-4 text-sm text-gray-700">{product.title}</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
            <AddToCartButton product={product} onAddToCart={handleAddToCart} />
        </div>
    );
}