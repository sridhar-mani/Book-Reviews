import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Star } from 'lucide-react';
import { ReviewForm } from '../components/reviews/ReviewForm';
import { ReviewList } from '../components/reviews/ReviewList';
import { useAuth } from '../contexts/AuthContext';

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: book, isLoading } = useQuery(['book', id], async () => {
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

  const averageRating =
    book.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) /
    (book.reviews.length || 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-8">
        <img
          src={book.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e'}
          alt={book.title}
          className="w-full lg:w-1/3 rounded-md"
        />
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-bold">{book.title}</h1>
          <p className="text-lg text-muted-foreground">{book.author}</p>
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="ml-1 text-lg">
              {averageRating.toFixed(1)} / 5 ({book.reviews.length} reviews)
            </span>
          </div>
          <p>{book.description}</p>
          {/* Additional book details if needed */}
        </div>
      </div>

      {user && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
          <ReviewForm bookId={book.id} />
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        <ReviewList reviews={book.reviews} />
      </div>
    </div>
  );
}