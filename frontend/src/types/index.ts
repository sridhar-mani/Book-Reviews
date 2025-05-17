export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  coverImage?: string;
  description?: string;
  reviews: Review[];
  user: User;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
  };
  userId: string;
  bookId: string;
}