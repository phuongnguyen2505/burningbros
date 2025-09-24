'use client';

import { LuShoppingCart } from "react-icons/lu";

interface AddToCartButtonProps {
    onAddToCart: () => void;
}

export default function AddToCartButton({ onAddToCart }: AddToCartButtonProps) {
    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                onAddToCart();
            }}
            className="flex justify-center gap-2 items-center mt-4 w-full bg-[#272e3f] text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity cursor-pointer"
        >
            <LuShoppingCart />Add to Cart
        </button>
    );
}