import { useState } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../ui/use-toast';

interface ReviewFormProps {
  bookId: string;
}

export function ReviewForm({ bookId }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    () => {
      return axios.post(`/api/books/${bookId}/reviews`, { rating, comment });
    },
    {
      onSuccess: () => {
        toast({ description: 'Review submitted successfully.' });
        setRating(5);
        setComment('');
        queryClient.invalidateQueries(['book', bookId]);
      },
      onError: () => {
        toast({ description: 'Failed to submit review.', variant: 'destructive' });
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mt-1 block w-full border rounded-md"
        >
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {value} Star{value > 1 ? 's' : ''}
            </option>
          ))}
        </select>
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
      <Button type="submit" disabled={mutation.isLoading}>
        Submit Review
      </Button>
    </form>
  );
}