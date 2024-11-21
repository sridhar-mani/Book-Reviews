import { Star } from 'lucide-react';

interface ReviewListProps {
  reviews: any[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return <p>No reviews yet. Be the first to review this book!</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border p-4 rounded-md">
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{review.rating} / 5</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Reviewed by {review.user.name || 'Anonymous'}
          </p>
          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  );
}