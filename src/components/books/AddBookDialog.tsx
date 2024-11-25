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

export function AddBookDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/books', data);
      toast({ description: 'Book added successfully.' });
      queryClient.invalidateQueries('books');
      setOpen(false)
    } catch (error) {
      toast({ description: 'Failed to add book.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Book</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
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
          <Button type="submit">Add Book</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}