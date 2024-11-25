import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Book } from '@/types';

interface DeleteBookDialogProps {
  book: Book;
  open:boolean;
  onBookUpdated: () => void;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteBookDialog({ book,open, onBookUpdated,onOpenChange }: DeleteBookDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      console.log(book);
      await axios.delete(`/api/books/${book.id}`);
      toast({ description: 'Book deleted successfully.' });
      queryClient.invalidateQueries('books');
      onBookUpdated();
    } catch (error) {
      toast({ description: 'Failed to delete book.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange = {onOpenChange}>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this book? This action cannot be undone.</p>
        <Button onClick={handleDelete} variant="destructive">Delete</Button>
      </DialogContent>
    </Dialog>
  );
}