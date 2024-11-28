import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { StarRating } from '@/components/reviews/StarRating';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewList } from '@/components/reviews/ReviewList';
import { useAuth } from '../contexts/AuthContext';

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: book, isLoading, refetch } = useQuery(['book', id], async () => {
    const res = await axios.get(`/api/books/${id}`);
    return res.data.book;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Book not found.</p>
      </div>
    );
  }

  // Calculate average rating
  const averageRating =
    book.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) /
    (book.reviews.length || 1);

  return (
    <div className="space-y-6">
      {/* Book Details */}
      <h1 className="text-4xl font-bold">{book.title}</h1>
      <p className="text-lg">by {book.author}</p>
      <div className="flex items-center mt-2">
        <StarRating rating={averageRating} readonly size="md" />
        <span className="ml-2 text-sm">({book.reviews.length} reviews)</span>
      </div>
      {/* ...other book details... */}

      {/* Review Form */}
      {user && (
        <div>
          <h2 className="text-2xl font-bold mt-8 mb-4">Write a Review</h2>
          <ReviewForm bookId={book.id} onReviewSubmitted={refetch} />
        </div>
      )}

      {/* Review List */}
      <div>
        <h2 className="text-2xl font-bold mt-8 mb-4">Reviews</h2>
        <ReviewList reviews={book.reviews} currentUser={user} onReviewUpdated={refetch} />
      </div>
    </div>
  );
}