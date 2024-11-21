// test.js
const request = require('supertest');
const app = require('./server');
const prisma = require('./db');

let authToken;
let bookId;
let reviewId;

beforeAll(async () => {
  // Clean up database before tests
  await prisma.review.deleteMany({});
  await prisma.book.deleteMany({});
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Authentication', () => {
  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'password123'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe('testuser@example.com');
    });

    it('should not register user with existing email', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User 2',
          email: 'testuser@example.com',
          password: 'password123'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Email already exists.');
    });
  });

  describe('POST /auth/login', () => {
    it('should login user with valid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      authToken = res.body.token;
    });

    it('should not login with invalid password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'wrongpassword'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid email or password.');
    });
  });
});

describe('Book Management', () => {
  describe('POST /books', () => {
    it('should create a new book', async () => {
      const res = await request(app)
        .post('/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Book',
          author: 'Test Author',
          isbn: '1234567890',
          genre: 'Fiction',
          coverImage: 'https://example.com/cover.jpg'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('book');
      bookId = res.body.book.id;
    });

    it('should not create book without authentication', async () => {
      const res = await request(app)
        .post('/books')
        .send({
          title: 'Test Book 2',
          author: 'Test Author',
          isbn: '0987654321',
          genre: 'Non-Fiction'
        });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /books', () => {
    it('should get all books with pagination', async () => {
      const res = await request(app)
        .get('/books')
        .query({ page: 1, limit: 10 });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('books');
      expect(res.body).toHaveProperty('totalPages');
      expect(res.body).toHaveProperty('totalBooks');
      expect(Array.isArray(res.body.books)).toBeTruthy();
    });

    it('should filter books by genre', async () => {
      const res = await request(app)
        .get('/books')
        .query({ genre: 'Fiction' });
      expect(res.statusCode).toBe(200);
      expect(res.body.books.every(book => book.genre === 'Fiction')).toBeTruthy();
    });

    it('should sort books by title', async () => {
      const res = await request(app)
        .get('/books')
        .query({ sortBy: 'title', order: 'asc' });
      expect(res.statusCode).toBe(200);
      const titles = res.body.books.map(book => book.title);
      expect(titles).toEqual([...titles].sort());
    });
  });

  describe('PUT /books/:id', () => {
    it('should update a book', async () => {
      const res = await request(app)
        .put(`/books/${bookId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Book Title',
          genre: 'Mystery'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.book.title).toBe('Updated Book Title');
      expect(res.body.book.genre).toBe('Mystery');
    });
  });
});

describe('Review Management', () => {
  describe('POST /reviews', () => {
    it('should create a review', async () => {
      const res = await request(app)
        .post('/reviews')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          bookId: bookId,
          rating: 4,
          content: 'Great book!'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('review');
      reviewId = res.body.review.id;
    });

    it('should validate rating range', async () => {
      const res = await request(app)
        .post('/reviews')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          bookId: bookId,
          rating: 6,
          content: 'Invalid rating'
        });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('PUT /reviews/:id', () => {
    it('should update a review', async () => {
      const res = await request(app)
        .put(`/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          rating: 5,
          content: 'Updated review content'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.review.rating).toBe(5);
      expect(res.body.review.comment).toBe('Updated review content');
    });
  });

  describe('DELETE /reviews/:id', () => {
    it('should delete a review', async () => {
      const res = await request(app)
        .delete(`/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
    });
  });
});

describe('Book Recommendations', () => {
  describe('GET /recommendations/:bookId', () => {
    it('should get book recommendations', async () => {
      const res = await request(app)
        .get(`/recommendations/${bookId}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeLessThanOrEqual(5);
    });

    it('should return 404 for non-existent book', async () => {
      const res = await request(app)
        .get('/recommendations/nonexistentid');
      expect(res.statusCode).toBe(404);
    });
  });
});

describe('DELETE /books/:id', () => {
  it('should delete a book', async () => {
    const res = await request(app)
      .delete(`/books/${bookId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
  });
});