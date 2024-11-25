import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (rating: number) => void;
  readonly?: boolean;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  onChange,
  readonly = false,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const filled = starValue <= rating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => !readonly && onChange?.(starValue)}
            className={cn(
              'focus:outline-none transition-colors',
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            )}
            disabled={readonly}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'transition-colors',
                filled
                  ? 'fill-yellow-400 stroke-yellow-400'
                  : 'fill-transparent stroke-gray-300'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}