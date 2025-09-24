'use client';

import { useAnimation } from '@/context/AppProviders';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { LuShoppingBag } from 'react-icons/lu';

export default function CartIconWithCount() {
    const items = useCartStore((state) => state.items);
    const [isClient, setIsClient] = useState(false);
    const { setCartRef } = useAnimation();
    const cartIconRef = useRef<HTMLAnchorElement | null>(null);

    useEffect(() => {
        setIsClient(true);
        if (cartIconRef.current) {
            setCartRef(cartIconRef.current);
        }
    }, [setCartRef]);

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <Link
            ref={cartIconRef}
            href="/cart"
            className="relative p-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Open cart"
        >
            <LuShoppingBag className="h-6 w-6" />
            {isClient && totalItems > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-3 flex h-4 w-4 items-center text-white justify-center rounded-full bg-red-500 text-xs font-medium text-primary-foreground">
                    {totalItems}
                </span>
            )}
        </Link>
    );
}