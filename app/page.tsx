'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Product } from '@/types';
import ProductCard from '@/components/ui/products/ProductCard';
import { searchProducts } from '@/libs/api';
import { useDebounce } from '@/hooks/useDebounce';
import { LuSearch } from 'react-icons/lu';
import Skeleton from '@/components/ui/products/Skeleton';

const ITEMS_PER_PAGE = 20;

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const { ref, inView } = useInView({ threshold: 0 });

  const loadMoreProducts = async () => {
    setIsLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const response = await fetch(`https://dummyjson.com/products?limit=${ITEMS_PER_PAGE}&skip=${offset}`);
    const data = await response.json();
    setIsLoadingMore(false);
    if (data.products.length > 0) {
      setProducts((prev) => [...prev, ...data.products]);
      setOffset((prev) => prev + ITEMS_PER_PAGE);
    } else {
      setHasMore(false);
    }
  };

  useEffect(() => {
    if (inView && hasMore && !debouncedSearchTerm && !isLoadingMore) {
      loadMoreProducts();
    }
  }, [inView, hasMore, debouncedSearchTerm, isLoadingMore]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      setSearchResults([]);
      searchProducts(debouncedSearchTerm)
        .then(data => {
          setSearchResults(data.products);
        })
        .finally(() => {
          setIsSearching(false);
        });
    } else {
      setIsSearching(false);
      setSearchResults(null);
    }
  }, [debouncedSearchTerm]);

  const productsToDisplay = searchResults !== null ? searchResults : products;
  const isSearchActive = searchResults !== null;

  return (
    <>
      <section className="text-center mb-12">
        <div className="mt-8 max-w-md mx-auto relative">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search all products..."
            className="w-full rounded-full border bg-muted px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary pr-12"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground pointer-events-none">
            <LuSearch className="h-5 w-5" />
          </div>
        </div>
      </section>
      <section>
        {isSearching ? (
          <p className="text-center">Searching...</p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {productsToDisplay.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {isLoadingMore && (
              Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={`skeleton-${index}`} />
              ))
            )}
          </div>
        )}
        {isSearchActive && !isSearching && productsToDisplay.length === 0 && (
          <p className="text-center text-muted-foreground">No products found for {debouncedSearchTerm}.</p>
        )}
        <div ref={ref} className="h-10" />
      </section>
    </>
  );
}