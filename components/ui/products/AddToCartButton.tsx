'use client';
import { useModal } from '@/context/AppProviders';
import { Product } from '@/types';

interface AddToCartButtonProps {
    onAddToCart: () => void;
    product: Product;
}

export default function AddToCartButton({ onAddToCart, product }: AddToCartButtonProps) {
    const { openModal } = useModal();

    const handleClick = () => {
        onAddToCart();
        openModal({
            title: 'Success!',
            message: `${product.title} has been added to your cart.`,
            confirmText: 'Great!',
        });
    };

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                handleClick();
            }}
            className="..."
        >
            Add to Cart
        </button>
    );
}