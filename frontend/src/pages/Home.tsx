import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; 

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
      <BookOpen className="h-16 w-16 mb-6 text-primary" />
      <h1 className="text-4xl font-bold mb-4">Welcome to BookReview</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        Discover your next favorite book through our community of readers. Share your thoughts,
        rate books, and connect with fellow book lovers.
      </p>
      <div className="flex gap-4">
        {!user ? (
          <>
            <Link to="/books">
              <Button size="lg">
                Browse Books
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg">
                Join Community
              </Button>
            </Link>
          </>
        ) : (
          <>
            {/* Add options for logged-in users here */}
            <Link to="/profile">
              <Button size="lg">
                My Profile
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}