// src/components/reviews/StarRating.tsx
import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  size = 'md',
  readonly = true,
  onChange,
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = React.useState(0);
  const stars = [1, 2, 3, 4, 5];

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 32 : 24;

  return (
    <div className="flex">
      {stars.map((value) => {
        const isFilled = value <= (hoveredRating || rating);
        return (
          <button
            key={value}
            type="button"
            onClick={() => !readonly && onChange && onChange(value)}
            onMouseEnter={() => !readonly && setHoveredRating(value)}
            onMouseLeave={() => !readonly && setHoveredRating(0)}
            disabled={readonly}
            className="p-1"
          >
            {isFilled ? (
              <FaStar size={iconSize} className="text-yellow-500" />
            ) : (
              <FaRegStar size={iconSize} className="text-gray-300" />
            )}
          </button>
        );
      })}
    </div>
  );
}