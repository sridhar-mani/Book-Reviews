import { useState } from 'react';
import { Review } from '@/types';
import { StarRating } from './StarRating';
import { Button } from '@/components/ui/button';
import { Textarea } from '../ui/textarea';
import axios from 'axios';

interface ReviewListProps {
  reviews: Review[];
  currentUser: any;
  onReviewUpdated: () => void;
}

export function ReviewList({ reviews, currentUser, onReviewUpdated }: ReviewListProps) {
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editedComment, setEditedComment] = useState('');
  const [editedRating, setEditedRating] = useState(5);

  const startEditing = (review: Review) => {
    setEditingReviewId(review.id);
    setEditedComment(review.comment);
    setEditedRating(review.rating);
  };

  const cancelEditing = () => {
    setEditingReviewId(null);
    setEditedComment('');
    setEditedRating(5);
  };

  const submitEdit = async (reviewId: string) => {
    try {
      await axios.put(`/api/reviews/${reviewId}`, {
        rating: editedRating,
        comment: editedComment,
      });
      cancelEditing();
      onReviewUpdated();
    } catch (error) {
      console.error('Failed to update review:', error);
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      await axios.delete(`/api/reviews/${reviewId}`);
      onReviewUpdated();
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="p-4 border rounded-md">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{review.user.name}</span>
            <StarRating rating={review.rating} readonly size="sm" />
          </div>
          <p className="mt-2">{review.comment}</p>
          {editingReviewId === review.id ? (
            <>
              <Textarea
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                required
                className="mt-2"
              />
              <div className="flex items-center mt-2">
                <label className="mr-2">Rating:</label>
                <StarRating
                  rating={editedRating}
                  readonly={false}
                  size="sm"
                  onChange={setEditedRating}
                />
              </div>
              <div className="flex space-x-2 mt-2">
                <Button onClick={() => submitEdit(review.id)}>Save</Button>
                <Button variant="secondary" onClick={cancelEditing}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="mt-2">{review.comment}</p>
              {currentUser?.id === review.user.id && (
                <div className="flex space-x-2 mt-2">
                  <Button size="sm" onClick={() => startEditing(review)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteReview(review.id)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}