'use client';

import { useForm, SubmitHandler, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TCheckoutSchema, checkoutSchema } from '@/libs/validators';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCardType } from '@/utils/cardUtils';
import { RiMastercardLine, RiVisaLine } from 'react-icons/ri';
import { CiCreditCard2 } from 'react-icons/ci';
import { updateUser } from '@/libs/api';
import { useAuthStore } from '@/store/authStore';

const FormError = ({ message }: { message?: string }) => {
    if (!message) return null;
    return <p className="text-sm text-red-500 mt-1">{message}</p>;
};

const CardTypeIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'visa': return <RiVisaLine />;
        case 'mastercard': return <RiMastercardLine />;
        default: return <CiCreditCard2 className="w-6 h-6 text-gray-400" />;
    }
}

export default function CheckoutPage() {
    const { user } = useAuthStore();
    const items = useCartStore((state) => state.items);
    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const router = useRouter();
    const [cardType, setCardType] = useState('unknown');

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
        if (items.length === 0 && !isSubmitting) {
            router.push('/');
        }
    }, [items, router, isSubmitting]);

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

    useEffect(() => {
        if (cardNumber) {
            const type = getCardType(cardNumber.replace(/\D/g, ''));
            setCardType(type);
        } else {
            setCardType('unknown');
        }
    }, [cardNumber]);

    const onSubmit: SubmitHandler<TCheckoutSchema> = async (data) => {
        if (!user) {
            alert("You must be logged in to place an order.");
            router.push('/login');
            return; 
        }
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("Form data submitted:", data);
        const updatedUserData = await updateUser(user.id, {
            address: {
                address: data.address,
                city: 'N/A',
                postalCode: 'N/A',
            },
        });
        console.log("User updated successfully (simulated):", updatedUserData);
        console.log("Simulating: DELETE /carts/{id}");
        router.push('/checkout/success');
    };

    const onInvalid: SubmitHandler<FieldErrors<TCheckoutSchema>> = (errors) => {
        console.error("Form validation failed:", errors);
        alert("Please check your input. Some fields are invalid.");
    };

    if (items.length === 0) {
        return <p>Redirecting to homepage...</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-full">
                                <label htmlFor="name" className="block text-sm font-medium">First Name *</label>
                                <input id="name" {...register('firstName')} className="mt-1 p-2 w-full block border-gray-300 rounded-md shadow-sm" />
                                <FormError message={errors.firstName?.message} />
                            </div>
                            <div className="w-full">
                                <label htmlFor="name" className="block text-sm font-medium">Last Name *</label>
                                <input id="name" {...register('lastName')} className="mt-1 p-2 w-full block border-gray-300 rounded-md shadow-sm" />
                                <FormError message={errors.lastName?.message} />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-full">
                                <label htmlFor="email">Email *</label>
                                <input id="email" type="email" {...register('email')} className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
                                <FormError message={errors.email?.message} />
                            </div>
                            <div className="w-full">
                                <label htmlFor="phone">Phone *</label>
                                <input id="phone" {...register('phone')} className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
                                <FormError message={errors.phone?.message} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="address">Address *</label>
                            <input id="address" {...register('address')} className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
                            <FormError message={errors.address?.message} />
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mt-8 mb-4">Payment Information</h2>
                    <div className="space-y-4">
                        <div className="relative">
                            <input id="cardNumber" {...register('cardNumber')}
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                                className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm pr-12"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <CardTypeIcon type={cardType} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="expiryDate">Expiry Date *</label>
                                <input id="expiryDate"
                                    {...register('expiryDate', {
                                        onChange: (e) => {
                                            const value = e.target.value;
                                            let formattedValue = value.replace(/\D/g, '');
                                            if (formattedValue.length > 2) {
                                                formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
                                            }
                                            formattedValue = formattedValue.slice(0, 5);
                                            e.target.value = formattedValue;
                                        }
                                    })}
                                    placeholder="MM/YY"
                                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm"
                                />
                                <FormError message={errors.expiryDate?.message} />
                            </div>
                            <div>
                                <label htmlFor="cvv">CVV *</label>
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
                    <div className="flex justify-between mb-4">
                        <span>Shipping</span>
                        <span className="text-green-500">Free</span>
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-6 w-full bg-black text-white py-2 rounded-md disabled:bg-opacity-50 cursor-pointer"
                    >
                        {isSubmitting ? 'Processing...' : `Place Order - $${totalPrice.toFixed(2)}`}
                    </button>
                </div>
            </form>
        </div>
    );
}