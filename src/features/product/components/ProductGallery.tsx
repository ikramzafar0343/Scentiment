import { useCallback } from 'react';
import { cn } from '@/lib/utils';

function Thumbnail({
  src,
  alt,
  selected,
  index,
  onSelectIndex,
}: {
  src: string;
  alt: string;
  selected: boolean;
  index: number;
  onSelectIndex: (index: number) => void;
}) {
  const handleClick = useCallback(() => onSelectIndex(index), [index, onSelectIndex]);
  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'relative flex-shrink-0 aspect-square w-20 overflow-hidden rounded-lg border-2 transition-all',
        selected ? 'border-gray-900 shadow-md scale-105' : 'border-gray-200 hover:border-gray-400'
      )}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" decoding="async" />
    </button>
  );
}

export function ProductGallery({
  name,
  badge,
  images,
  selectedIndex,
  onSelectIndex,
}: {
  name: string;
  badge?: string;
  images: string[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {badge ? (
          <div className="absolute left-4 top-4 z-10 rounded-full bg-black px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-lg">
            {badge}
          </div>
        ) : null}
        <img
          src={images[selectedIndex]}
          alt={name}
          className="h-full w-full object-cover transition-opacity duration-300"
          loading="eager"
          decoding="async"
        />
      </div>

      {images.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {images.map((img, idx) => (
            <Thumbnail
              key={`${img}-${idx}`}
              src={img}
              alt={`${name} view ${idx + 1}`}
              selected={selectedIndex === idx}
              index={idx}
              onSelectIndex={onSelectIndex}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
