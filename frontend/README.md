# BookReview App

## Overview

BookReview is a platform where users can discover, review, and share their favorite books.

## Setup Instructions

### Prerequisites

- Node.js v14+
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/sridhar-mani/book-review-app.git
   cd book-review-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   PORT=3001
   ```

4. **Run database migrations:**

   ```bash
   npx prisma migrate deploy
   ```

5. **Start the application:**

   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- **Register User**

  `POST /api/auth/register`

  **Request Body:**

  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }