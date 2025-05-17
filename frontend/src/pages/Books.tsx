import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BookGrid } from '@/components/books/BookGrid';
import { BookSearch } from '@/components/books/BookSearch';
import { BookFilters } from '@/components/books/BookFilters';
import { Book } from '@/types';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Pagination } from '../components/ui/pagination';
import { AddBookDialog } from '../components/books/AddBookDialog';
import { useAuth } from '../contexts/AuthContext';



const ITEMS_PER_PAGE = 12;

export default function Books() {
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedSort, setSelectedSort] = useState('title_asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { user } = useAuth();

  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:3001/api/books');
      return data;
    },
  });

  const genres = [...new Set(books.map((book) => book.genre))];

  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());
    
    const matchesGenre = !selectedGenre || book.genre === selectedGenre;
    
    return matchesSearch && matchesGenre;
  });

  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Books</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <BookFilters
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
            genres={genres}
          />
          <div className="w-full sm:w-72">
            <BookSearch value={search} onChange={setSearch} />
          </div>
          {user && 
          <AddBookDialog/>
            }
        </div>
      </div>
      {paginatedBooks.length > 0 ? (
        <>
          <BookGrid books={paginatedBooks} onBookUpdated={()=>console.log('done')}/>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredBooks.length / ITEMS_PER_PAGE)}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No books found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}