import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface FilterSidebarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  className?: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function FilterSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  className,
  isOpenMobile,
  onCloseMobile
}: FilterSidebarProps) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
          isOpenMobile ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onCloseMobile}
      />

      <aside className={cn(
        "w-[280px] flex-shrink-0 lg:block",
        "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:static lg:transform-none lg:z-0",
        "bg-white/95 backdrop-blur-xl shadow-xl lg:bg-transparent lg:shadow-none",
        "border-r border-black/10 lg:border-none",
        isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        className
      )}>
        <div className="h-full overflow-y-auto p-6 lg:p-0 lg:max-h-[calc(100vh-150px)] lg:overflow-y-auto scrollbar-hide">
          <div className="ui-card p-6">
            <div className="flex items-center justify-between mb-8 lg:hidden">
             <span className="text-lg font-bold uppercase tracking-widest">Filters</span>
             <button onClick={onCloseMobile} className="p-2 hover:bg-gray-100 rounded-full transition-colors ui-focus-ring" aria-label="Close filters">
               <X className="w-5 h-5" />
             </button>
            </div>

            <div className="space-y-8">
              <div className="border-b border-black/10 pb-8">
              <button 
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center justify-between w-full mb-4 group ui-focus-ring rounded-lg"
              >
                <h3 className="font-bold uppercase text-xs tracking-widest group-hover:text-gray-600 transition-colors">Categories</h3>
                {isCategoryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {isCategoryOpen && (
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <button 
                      onClick={() => onSelectCategory('All Products')}
                      className={cn(
                        'ui-menu-item ui-focus-ring text-left',
                        selectedCategory === 'All Products' ? 'bg-black/[0.04] text-gray-900 font-semibold' : ''
                      )}
                    >
                      All Products
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button 
                        onClick={() => onSelectCategory(cat)}
                        className={cn(
                          'ui-menu-item ui-focus-ring text-left',
                          selectedCategory === cat ? 'bg-black/[0.04] text-gray-900 font-semibold' : ''
                        )}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <button 
                onClick={() => setIsPriceOpen(!isPriceOpen)}
                className="flex items-center justify-between w-full mb-4 group ui-focus-ring rounded-lg"
              >
                <h3 className="font-bold uppercase text-xs tracking-widest group-hover:text-gray-600 transition-colors">Price Range</h3>
                 {isPriceOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {isPriceOpen && (
                <div className="space-y-6 pt-2">
                  <div className="flex items-center justify-between text-sm font-medium text-black">
                    <span>€{priceRange[0]}</span>
                    <span>€{priceRange[1]}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="2000" 
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black hover:accent-gray-800"
                  />
                  <div className="flex justify-end">
                     <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onPriceChange([0, 2000])}
                        className="text-[10px] h-7 px-3 uppercase tracking-wider"
                     >
                        Reset
                     </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      </aside>
    </>
  );
}
