import { HiStar } from 'react-icons/hi';
import { cn } from '@/lib/utils';

export function ProductHeaderInfo({
  category,
  name,
  rating,
  reviews,
  coverage,
  description,
}: {
  category: string;
  name: string;
  rating?: number;
  reviews?: number;
  coverage: string | null;
  description?: string;
}) {
  const safeRating = rating ?? 0;

  return (
    <div className="space-y-4">
      <div className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">{category}</div>
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">{name}</h1>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <HiStar
                key={i}
                className={cn(
                  'h-4 w-4',
                  i < safeRating ? 'fill-[#d4af37] text-[#d4af37]' : 'text-gray-300'
                )}
              />
            ))}
          </div>
          <span className="ml-1 text-sm font-medium text-gray-600">
            {reviews ? `${safeRating.toFixed(1) || '0.0'} (${reviews} reviews)` : 'No reviews yet'}
          </span>
        </div>

        {coverage ? (
          <div className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700">
            Covers up to <span className="font-semibold text-gray-900">{coverage}</span>
          </div>
        ) : null}
      </div>

      {description ? (
        <p className="text-base leading-relaxed text-gray-600 sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

