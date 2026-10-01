# Bibliocholy 📚

Bibliocholy is a full-stack book tracker I built to keep track of my personal reading library.

The app lets you add books, track your reading status, rate books, keep notes, and view reading statistics. You can also search for books using the Open Library API instead of entering everything manually.

Live site: https://bibliocholy.onrender.com

## Features

- Create an account and log in
- Add, edit, and delete books
- Search for books through the Open Library API
- Track books as Want To Read, Reading, Finished, or Did Not Finish
- Rate books
- Add notes and summaries
- Track start and finish dates
- Save information like genre, series, ISBN, publisher, format, and page count
- View reading statistics
- Import and export your library
- Each user's books are kept separate
- Responsive web interface

## Tech

- React
- Vite
- React Router
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- JavaScript
- CSS
- Playwright
- Open Library API
- Render
- MongoDB Atlas

## Security

The app uses JWT authentication with HttpOnly cookies so the authentication token isn't accessible through client-side JavaScript.

It also includes:

- CSRF protection
- Password hashing
- Protected API routes
- Rate limiting
- CORS configuration
- Secure production cookies
- Environment variables for database credentials and other secrets

## Testing

I use Playwright for end-to-end testing.

Run the tests with:

npx playwright test

## Deployment

The frontend and backend are deployed separately through Render.

Frontend:
https://bibliocholy.onrender.com

Backend:
https://book-tracker-0of6.onrender.com

The production database is hosted through MongoDB Atlas.

## Why I Built It

I wanted a project that would give me experience building something from start to finish instead of just making a frontend demo.

This project gave me practice with React, REST APIs, authentication, MongoDB, API integration, automated testing, and deploying a full-stack application.
