import LoadMoreProducts from '@/components/ui/products/LoadMoreProduct';
import ProductCard from '@/components/ui/products/ProductCard';
import { getProducts } from '@/libs/api';

export default async function Home() {
  const initialProductsData = await getProducts(20);

  return (
    <>
      <section>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {initialProductsData.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <LoadMoreProducts />
      </section>
    </>
  );
}