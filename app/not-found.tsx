import Link from 'next/link';
export const dynamic = 'force-dynamic';

export default function NotFound() {
    return (
        <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Page Not Found
            </h1>
            <p className="mt-6 text-base leading-7 text-gray-600">
                Sorry, we couldn’t find the page you’re looking for.
            </p>
            <div className="mt-10">
                <Link
                    href="/"
                    className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
                >
                    Go back home
                </Link>
            </div>
        </div>
    );
}