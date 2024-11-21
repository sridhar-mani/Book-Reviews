import { Book } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Star } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const averageRating = book.reviews.reduce((sum, review) => sum + review.rating, 0) / (book.reviews.length || 1);

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="aspect-[2/3] relative overflow-hidden rounded-md mb-4">
          <img
            src={book.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e'}
            alt={book.title}
            className="object-cover w-full h-full"
          />
        </div>
        <CardTitle className="line-clamp-2">{book.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="ml-1 text-sm">{averageRating.toFixed(1)} / 5</span>
          <span className="ml-2 text-xs text-muted-foreground">({book.reviews.length} reviews)</span>
        </div>
      </CardContent>
    </Card>
  );
}