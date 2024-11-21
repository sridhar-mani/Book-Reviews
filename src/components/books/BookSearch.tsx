import { Input } from '../../../components/ui/input';
import { Search } from 'lucide-react';

interface BookSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function BookSearch({ value, onChange }: BookSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="search"
        placeholder="Search books..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}