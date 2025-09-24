'use client';

import { Product } from '@/types';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import { useCartStore } from '@/store/cartStore';
import { useAnimation } from '@/context/AppProviders';
import { useRef } from 'react';
import { FaStar } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const imageRef = useRef<HTMLDivElement | null>(null);
    const { triggerAnimation } = useAnimation();
    const addItem = useCartStore((state) => state.addItem);
    const { user } = useAuthStore();
    const router = useRouter();

    const handleAddToCart = () => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (imageRef.current) {
            const rect = imageRef.current.getBoundingClientRect();
            triggerAnimation({
                imageSrc: product.thumbnail,
                startRect: rect,
            });
        }
        setTimeout(() => {
            addItem(product);
        }, 100);
    };

    return (
        <div className='group relative flex flex-col gap-1 border border-gray-200 p-4 rounded-lg hover:shadow-lg transition-shadow'>
            <div
                ref={imageRef}
                className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg xl:aspect-h-8 xl:aspect-w-7"
            >
                <Image
                    src={product.thumbnail}
                    alt={product.title}
                    width={400}
                    height={400}
                    loading="lazy"
                    className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                />
            </div>
            <h3 className="mt-4 text-lg font-semibold ">{product.title}</h3>
            <span className="mt-2 text-sm text-gray-700 line-clamp-2">{product.description}</span>
            <div className="flex justify-between items-center">
                <p className="mt-1 text-sm font-medium text-gray-900 flex items-center gap-1"><FaStar color="#facc15" />{product.rating}</p>
                <p className="mt-1 text-sm font-semibold text-gray-900 border border-gray-200 rounded-3xl px-2">{product.brand}</p>
            </div>
            <p className="mt-1 text-lg font-bold text-gray-900">${product.price}</p>
            <AddToCartButton onAddToCart={handleAddToCart} />
        </div>
    );
}