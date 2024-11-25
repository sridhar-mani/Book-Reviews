import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { BookOpen, LogIn, LogOut, UserPlus } from 'lucide-react';
import { ThemeToggle } from './theme/ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span className="font-bold text-xl">BookReview</span>
            </Link>
            <Link to="/books" className="text-foreground/80 hover:text-foreground transition-colors">
              Browse Books
            </Link>
            {user && (
              <Link to="/my-books" className="text-foreground/80 hover:text-foreground transition-colors">
                My Books
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <>
                <span className="text-sm text-foreground/80">
                  Welcome, {user.name || user.email}
                </span>
                <Button variant="ghost" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">
                    <LogIn className="w-4 h-4 mr-1" />
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button>
                    <UserPlus className="w-4 h-4 mr-1" />
                    Join Community
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}