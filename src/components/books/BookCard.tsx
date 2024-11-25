import { useState } from 'react';
import { Book } from '@/types';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/reviews/StarRating';
import { Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DeleteBookDialog } from './DeleteBookDialogue';
import { EditBookDialog } from './EditBookDialog';

interface BookCardProps {
  book: Book;
  onBookUpdated: () => void;
}

export function BookCard({ book, onBookUpdated }: BookCardProps) {
  const { user } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const averageRating =
    book.reviews.reduce((acc, review) => acc + review.rating, 0) / (book.reviews.length || 1);

  const isOwner = user?.id === book.user.id;

  return (
    <>
      <Card className="h-full hover:shadow-lg transition-shadow group relative">
        <CardHeader className="p-0">
          <div className="aspect-[2/3] relative overflow-hidden rounded-t-md">
            <img
              src={book.coverImage || 'https://via.placeholder.com/150'}
              alt={book.title}
              className="object-cover w-full h-full"
            />
          </div>
          {isOwner && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditDialog(true)}
                className="p-1"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="p-1"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold">{book.title}</h3>
          <p className="text-sm text-muted-foreground">{book.author}</p>
          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={averageRating} readonly size="sm" />
            <span className="text-sm">({book.reviews.length})</span>
          </div>
          <p className="text-sm mt-2 text-muted-foreground">{book.genre}</p>
                {/* Delete Book Dialog */}
                <div className='flex flex-row self '>
      <DeleteBookDialog
        book={book}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDeleted={onBookUpdated}
      />

      {/* Edit Book Dialog */}
      <EditBookDialog
        book={book}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onUpdated={onBookUpdated}
      />
      </div>
        </CardContent>
      </Card>


    </>
  );
}