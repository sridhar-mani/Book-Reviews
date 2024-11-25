import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface DeleteBookDialogProps {
  bookId: string;
  onBookDeleted: () => void;
}

export function DeleteBookDialog({ bookId, onBookDeleted }: DeleteBookDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/books/${bookId}`);
      toast({ description: 'Book deleted successfully.' });
      queryClient.invalidateQueries('books');
      onBookDeleted();
    } catch (error) {
      toast({ description: 'Failed to delete book.', variant: 'destructive' });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
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