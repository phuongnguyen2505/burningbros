'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TCheckoutSchema, checkoutSchema } from '@/libs/validators';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const FormError = ({ message }: { message?: string }) => {
    if (!message) return null;
    return <p className="text-sm text-red-500 mt-1">{message}</p>;
};

export default function CheckoutPage() {
    const items = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clearCart);
    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
    } = useForm<TCheckoutSchema>({
        resolver: zodResolver(checkoutSchema),
    });

    useEffect(() => {
        if (items.length === 0) {
            router.push('/');
        }
    }, [items, router]);

    const cardNumber = watch('cardNumber');
    useEffect(() => {
        const value = cardNumber;
        if (value) {
            const formattedValue = value.replace(/\D/g, '').replace(/(.{4})/g, '$1-').trim().slice(0, 19);
            if (value !== formattedValue) {
                setValue('cardNumber', formattedValue);
            }
        }
    }, [cardNumber, setValue]);


    const onSubmit: SubmitHandler<TCheckoutSchema> = async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log("Form data submitted:", data);
        console.log("Simulating API calls...");
        console.log("PUT /users/{id} with shipping info");
        console.log("DELETE /carts/{id}");

        clearCart();

        router.push('/checkout/success');
    };

    if (items.length === 0) {
        return <p>Redirecting to homepage...</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium">Name</label>
                            <input id="name" {...register('name')} className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
                            <FormError message={errors.name?.message} />
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input id="email" type="email" {...register('email')} className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
                            <FormError message={errors.email?.message} />
                        </div>
                        <div>
                            <label htmlFor="phone">Phone</label>
                            <input id="phone" {...register('phone')} className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
                            <FormError message={errors.phone?.message} />
                        </div>
                        <div>
                            <label htmlFor="address">Address</label>
                            <input id="address" {...register('address')} className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
                            <FormError message={errors.address?.message} />
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mt-8 mb-4">Payment Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="cardNumber">Card Number</label>
                            <input id="cardNumber" {...register('cardNumber')}
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                                className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" /
                            >
                            <FormError message={errors.cardNumber?.message} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="expiryDate">Expiry Date</label>
                                <input id="expiryDate" {...register('expiryDate')}
                                    placeholder="MM/YY"
                                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm"
                                />
                                <FormError message={errors.expiryDate?.message} />
                            </div>
                            <div>
                                <label htmlFor="cvv">CVV</label>
                                <input id="cvv" {...register('cvv')}
                                    placeholder="123"
                                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm"
                                />
                                <FormError message={errors.cvv?.message} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-muted p-6 rounded-lg h-fit">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-2">
                        {items.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.title} x {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-6 w-full bg-black text-white py-2 rounded-md disabled:bg-opacity-50"
                    >
                        {isSubmitting ? 'Processing...' : `Place Order - $${totalPrice.toFixed(2)}`}
                    </button>
                </div>
            </form>
        </div>
    );
}