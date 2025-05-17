import { Book } from '@/types';
import { BookCard } from './BookCard';
import { BookCardSkeleton } from './BookCardSkeleton';

interface BookGridProps {
  books: Book[];
  onBookUpdated: () => void;
  isLoading?: boolean;
}

export function BookGrid({ books, onBookUpdated, isLoading }: BookGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
 
      {books.map((book) => (
        <BookCard 
          key={book.id} 
          book={book} 
          onBookUpdated={onBookUpdated}
        />
      ))}
    </div>
  );
}