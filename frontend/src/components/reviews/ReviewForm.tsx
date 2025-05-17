import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '../ui/textarea';
import { StarRating } from '@/components/reviews/StarRating';
import axios from 'axios';

interface ReviewFormProps {
  bookId: string;
  onReviewSubmitted: () => void;
}

export function ReviewForm({ bookId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await axios.post(`/api/books/${bookId}/reviews`, {
        rating,
        comment,
      });
      setRating(0);
      setComment('');
      onReviewSubmitted();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Rating</label>
        <StarRating
          rating={rating}
          onChange={setRating}
          readonly={false}
          size="md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Comment</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          placeholder="Write your review..."
        />
      </div>
      <Button type="submit">Submit Review</Button>
    </form>
  );
}