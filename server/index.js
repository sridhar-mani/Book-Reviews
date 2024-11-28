import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: 'http://localhost:3000', 
    credentials: true,
  })
);
app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ message: 'User already exists' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    console.log(email,password)

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/books', async (req, res, next) => {
  try {
    const books = await prisma.book.findMany({
      include: {
        reviews: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    next(error); 
  }
});


app.post('/api/books', authenticateToken, async (req, res) => {
  try {
    const { title, author, isbn, genre, description, coverImage } = req.body;
    const book = await prisma.book.create({
      data: {
        title,
        author,
        isbn,
        genre,
        description,
        coverImage,
        userId: req.user.id,
      },
    });
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: 'Invalid book data' });
  }
});

app.put('/api/books/:bookId', authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;
    const { title, author, isbn, genre, description, coverImage } = req.body;
    const book = await prisma.book.update({
      where: { id: bookId },
      data: {
        title,
        author,
        isbn,
        genre,
        description,
        coverImage,
      },
    });
    res.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(400).json({ message: 'Invalid book data' });
  }
});

app.delete('/api/books/:bookId', authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;
    const { title, author, isbn, genre, description, coverImage } = req.body;
    const book = await prisma.book.delete({
      where: { id: bookId }
    });

    res.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(400).json({ message: 'Invalid book data' });
  }
});


app.post('/api/books/:bookId/reviews', authenticateToken, async (req, res) => {
  const { bookId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  try {
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        user: { connect: { id: userId } },
        book: { connect: { id: bookId } },
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });
    res.json({ review });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Failed to create review' });
  }
});

app.get('/api/books/:bookId', async (req, res) => {
  const { bookId } = req.params;

  try {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        reviews: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    res.json({ book });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Failed to fetch book' });
  }
});
app.put('/api/reviews/:reviewId', authenticateToken, async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  try {
    // Verify ownership
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review || review.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { rating, comment },
    });
    res.json({ review: updatedReview });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Failed to update review' });
  }
});

app.delete('/api/reviews/:reviewId', authenticateToken, async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review || review.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Failed to delete review' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
