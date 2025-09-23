import Link from 'next/link';

export default function OrderSuccessPage() {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="mt-4 text-3xl font-bold">Order Placed Successfully!</h1>
            <p className="mt-2 text-muted-foreground">Thank you for your purchase. We will process your order shortly.</p>
            <Link href="/" className="mt-8 inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md">
                Continue Shopping
            </Link>
        </div>
    );
}