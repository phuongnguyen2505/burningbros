'use client';

import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="flex-grow container mx-auto px-6 py-12">
                {children}
            </main>
            <Footer />
        </>
    );
}