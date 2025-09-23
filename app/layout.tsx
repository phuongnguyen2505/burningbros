import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AppProviders } from '@/context/AppProviders';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-commerce',
  description: 'E-commerce Store',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} flex flex-col min-h-screen`}>
        <AppProviders>
          <Navbar />
          <main className="flex-grow container mx-auto px-6 py-12">
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html >
  );
}