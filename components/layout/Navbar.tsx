import Link from 'next/link';
import CartIconWithCount from './CartIconWithCount';

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto px-6 h-16 flex items-center">
                <div className="flex items-center space-x-8">
                    <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
                        ShopHub
                    </Link>
                    <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            All Products
                        </Link>
                    </div>
                </div>
                <div className="ml-auto">
                    <CartIconWithCount />
                </div>
            </nav>
        </header>
    );
}