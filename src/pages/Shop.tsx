import { PRODUCTS } from '@/lib/data';
import { ProductCard } from '@/components/ui/ProductCard';

export function Shop() {
  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8 text-center uppercase tracking-widest">Shop All</h1>
      
      {/* Filters Sidebar (Mock) */}
      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="w-full lg:w-64 flex-shrink-0">
           <div className="sticky top-24 space-y-8">
             <div>
               <h3 className="font-bold mb-4 uppercase text-sm tracking-wide">Categories</h3>
               <ul className="space-y-2 text-sm text-gray-600">
                 <li className="font-medium text-black">All Products</li>
                 <li className="hover:text-black cursor-pointer">Diffusers</li>
                 <li className="hover:text-black cursor-pointer">Fragrance Oils</li>
                 <li className="hover:text-black cursor-pointer">Candles</li>
                 <li className="hover:text-black cursor-pointer">Gift Sets</li>
               </ul>
             </div>
             <div>
               <h3 className="font-bold mb-4 uppercase text-sm tracking-wide">Price Range</h3>
               <div className="flex items-center gap-4">
                 <input type="range" min="0" max="200" className="w-full accent-black" />
               </div>
             </div>
           </div>
        </aside>

        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {[...PRODUCTS, ...PRODUCTS, ...PRODUCTS].map((product, i) => (
              <ProductCard key={`${product.id}-${i}`} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
