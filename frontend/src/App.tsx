import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import Navbar from './components/Navbar.tsx';
import Home from './pages/Home.tsx';
import Books from './pages/Books.tsx';
import BookDetails from './pages/BookDetails.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { ThemeProvider } from './components/theme/ThemeProvider.tsx';
import Profile from './pages/Profile.tsx'

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/books" element={<Books />} />
                  <Route path="/books/:id" element={<BookDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                
                </Routes>
              </main>
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;