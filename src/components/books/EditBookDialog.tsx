import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const schema = z.object({
  title: z.string().nonempty('Title is required.'),
  author: z.string().nonempty('Author is required.'),
  isbn: z.string().nonempty('ISBN is required.'),
  genre: z.string().nonempty('Genre is required.'),
  coverImage: z.string().url('Invalid URL').optional(),
});

interface EditBookDialogProps {
  book: any;
  open:boolean;
  onBookUpdated: () => any;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EditBookDialog({ book,open, onBookUpdated,onOpenChange }: EditBookDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: book,
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      console.log(book.id);
      await axios.put(`/api/books/${book.id}`, data);
      toast({ description: 'Book updated successfully.' });
      queryClient.invalidateQueries('books');
      onOpenChange(!open)
      onBookUpdated();
    } catch (error) {
      console.log(error);
      toast({ description: 'Failed to update book.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange = {onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input {...register('title')} />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Author</label>
            <Input {...register('author')} />
            {errors.author && <p className="text-red-500 text-sm">{errors.author.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ISBN</label>
            <Input {...register('isbn')} />
            {errors.isbn && <p className="text-red-500 text-sm">{errors.isbn.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Genre</label>
            <Input {...register('genre')} />
            {errors.genre && <p className="text-red-500 text-sm">{errors.genre.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cover Image URL</label>
            <Input {...register('coverImage')} />
            {errors.coverImage && <p className="text-red-500 text-sm">{errors.coverImage.message}</p>}
          </div>
          <Button type="submit">Update Book</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}