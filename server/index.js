

import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { body, validationResult, query } from 'express-validator';
import helmet from 'helmet';
import cors from 'cors';

dotenv.config();
const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));



const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. Token missing.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
};

const validatePagination = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];


app.post(
  '/api/auth/register',
  [
    body('name').notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Invalid email address.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });
      res.status(201).json({ message: 'User registered successfully.', user });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ error: 'Email already exists.' });
    }
  }
);

app.post(
  '/api/auth/login',
  [
    body('email').isEmail().withMessage('Invalid email address.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: 'Invalid email or password.' });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Login successful.', token });
    } catch (error) {
      res.status(500).json({ error: 'Failed to log in.' });
    }
  }
);

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user.' });
  }
});

app.get('/api/books', validatePagination, async (req, res) => {
  const {
    sortBy = 'createdAt',
    order = 'desc',
    genre,
    author,
    title,
    page = 1,
    limit = 10,
  } = req.query;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const skip = (page - 1) * parseInt(limit);
  const where = {};

  if (genre) where.genre = genre;
  if (author) where.author = { contains: author, mode: 'insensitive' };
  if (title) where.title = { contains: title, mode: 'insensitive' };

  try {
    const books = await prisma.book.findMany({
      where,
      include: { reviews: true },
      orderBy: { [sortBy]: order },
      skip,
      take: parseInt(limit),
    });

    const totalBooks = await prisma.book.count({ where });
    const totalPages = Math.ceil(totalBooks / limit);

    res.json({
      books,
      page: parseInt(page),
      totalPages,
      totalBooks,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve books' });
  }
});

app.post(
  '/api/books',
  authenticateToken,
  [
    body('title').notEmpty().withMessage('Title is required.'),
    body('author').notEmpty().withMessage('Author is required.'),
    body('isbn').notEmpty().withMessage('ISBN is required.'),
    body('genre').notEmpty().withMessage('Genre is required.'),
    body('coverImage').optional().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, isbn, genre, coverImage } = req.body;

    try {
      const book = await prisma.book.create({
        data: { title, author, isbn, genre, coverImage },
      });
      res.status(201).json({ message: 'Book created successfully.', book });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create book.' });
    }
  }
);

app.put(
  '/api/books/:id',
  authenticateToken,
  [
    body('title').optional().isString(),
    body('author').optional().isString(),
    body('isbn').optional().isString(),
    body('genre').optional().isString(),
    body('coverImage').optional().isString(),
    body('description').optional().isString(),
  ],
  async (req, res) => {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = { ...req.body };

    try {
      const book = await prisma.book.update({
        where: { id },
        data,
      });
      res.json({ message: 'Book updated successfully.', book });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update book.' });
    }
  }
);

app.delete('/api/books/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.book.delete({ where: { id } });
    res.json({ message: 'Book deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book.' });
  }
});

app.post(
  '/api/books/:bookId/reviews',
  authenticateToken,
  [
    body('bookId').notEmpty().withMessage('Book ID is required.'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),
    body('content').notEmpty().withMessage('Review content is required.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bookId, rating, content } = req.body;

    try {
      const review = await prisma.review.create({
        data: {
          rating,
          comment: content,
          bookId,
          userId: req.user.userId,
        },
      });
      res.status(201).json({ message: 'Review added successfully.', review });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add review.' });
    }
  }
);

app.put(
  '/api/reviews/:id',
  authenticateToken,
  [
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('content').optional().isString(),
  ],
  async (req, res) => {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = {};
    if (req.body.rating !== undefined) data.rating = req.body.rating;
    if (req.body.content !== undefined) data.comment = req.body.content;

    try {
      const review = await prisma.review.update({
        where: { id },
        data,
      });
      res.json({ message: 'Review updated successfully.', review });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update review.' });
    }
  }
);

app.delete('/api/reviews/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.review.delete({ where: { id } });
    res.json({ message: 'Review deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review.' });
  }
});

app.get('/api/recommendations/:bookId', async (req, res) => {
  const { bookId } = req.params;

  try {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const recommendations = await prisma.book.findMany({
      where: {
        OR: [
          { genre: book.genre },
          { author: book.author },
        ],
        NOT: { id: bookId },
      },
      take: 5,
    });

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve recommendations' });
  }
});

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on port ${process.env.PORT || 3001}`);
});