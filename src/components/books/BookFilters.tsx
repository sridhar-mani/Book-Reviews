import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BookFiltersProps {
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  genres: string[];
}

export function BookFilters({ selectedGenre, onGenreChange, genres }: BookFiltersProps) {
  return (
    <div className="w-48">
      <Select value={selectedGenre} onValueChange={onGenreChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genres</SelectItem>
          {genres.map((genre) => (
            <SelectItem key={genre} value={genre}>
              {genre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}