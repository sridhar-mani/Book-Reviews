import { useState } from 'react';
import { Book } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/reviews/StarRating';
import { Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { EditBookDialog } from './EditBookDialog';
import { DeleteBookDialog } from './DeleteBookDialogue';
import { Link } from 'react-router-dom';

interface BookCardProps {
  book: Book;
  onBookUpdated: () => void;
}

export function BookCard({ book, onBookUpdated }: BookCardProps) {
  const { user } = useAuth();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);


  const averageRating =
    book.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) /
    (book.reviews.length || 1);

  const isOwner = user?.name === book.user.name;

  return (
    <>
      <Card className="flex flex-col h-full group relative hover:shadow-lg transition-shadow">
        <div className="relative">
          <Link to={`/books/${book.id}`}>
            <div className="aspect-w-2 aspect-h-3 overflow-hidden rounded-t-md">
              <img
                src={book.coverImage || 'https://picsum.photos/id/156/300/300'}
                alt={book.title}
                className="object-cover w-full h-full"
              />
            </div>
          </Link>
          {isOwner && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditDialog(true)}
                className="p-2 bg-opacity-20 bg-black rounded-full"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="p-2 bg-opacity-20 bg-black rounded-full"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold">{book.title}</h3>
          <p className="text-sm text-muted-foreground">{book.author}</p>
          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={averageRating} readonly size="sm" />
            <span className="text-sm">({book.reviews.length})</span>
          </div>
          <p className="text-sm mt-2 text-muted-foreground">{book.genre}</p>
        </CardContent>
      </Card>

      {showEditDialog && (
        <EditBookDialog
          book={book}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onBookUpdated={onBookUpdated}
        />
      )}

      {showDeleteDialog && (
        <DeleteBookDialog
          book={book}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onBookUpdated={onBookUpdated}
        />
      )}
    </>
  );
}