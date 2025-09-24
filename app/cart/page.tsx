'use client';

import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import Image from 'next/image';
import { LuMinus, LuPlus, LuTrash2 } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';
import { ChangeEvent } from 'react';

export default function CartPage() {
    const { items, removeItem, updateQuantity, clearCart } = useCartStore();

    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>, itemId: number) => {
        const newQuantity = parseInt(e.target.value, 10);
        if (!isNaN(newQuantity) && newQuantity >= 0) {
            updateQuantity(itemId, newQuantity);
        }
    };
    const itemVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
    };
    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to remove all items from your cart?')) {
            clearCart();
        }
    };
    if (items.length === 0) {
        return (
            <div className="text-center">
                <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
                <p className="mt-2 text-muted-foreground">Looks like you have not added anything to your cart yet.</p>
                <Link href="/" className="mt-6 inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <motion.ul layout className="space-y-4">
                        <AnimatePresence>
                            {items.map((item) => (
                                <motion.li
                                    layout
                                    key={item.id}
                                    variants={itemVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg"
                                >
                                    <Image src={item.thumbnail} alt={item.title} width={80} height={80} className="rounded-md object-cover flex-shrink-0" />
                                    <div className="flex-grow">
                                        <h2 className="font-semibold">{item.title}</h2>
                                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button title="Decrease quantity" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-1 py-1 border rounded-md cursor-pointer hover:bg-muted">
                                            <LuMinus className="w-5 h-5" />
                                        </button>
                                        <input
                                            placeholder='Quantity'
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(e, item.id)}
                                            className="px-1 py-1 w-12 text-center border rounded-md"
                                            min="0"
                                        />
                                        <button title="Increase quantity" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-1 py-1 border rounded-md cursor-pointer hover:bg-muted">
                                            <LuPlus className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p className="font-semibold w-20 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                                    <button title="Remove item" onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 cursor-pointer">
                                        <LuTrash2 className='w-5 h-5' />
                                    </button>
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </motion.ul>
                    <button
                        onClick={handleClearCart}
                        className="mt-4 text-sm text-muted-foreground text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                    >
                        Clear Cart
                    </button>
                </div>
                <div className="md:col-span-1">
                    <div className="p-4 bg-muted rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="flex justify-between mb-2">
                            <span>Subtotal</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                            <span>Shipping</span>
                            <span className="text-green-500">Free</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <Link href="/checkout" className="mt-6 block w-full bg-black text-white text-center py-2 rounded-md cursor-pointer">
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}