import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Books from "./pages/Books";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import Layout from "./components/Layout";
import Stats from "./pages/Stats";
import BookDetails from "./pages/BookDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeRoute from "./components/HomeRoute";

import { getBooks } from "./api/books";

function App() {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    async function loadBooks() {
      const savedBooks = await getBooks();
      setBooks(savedBooks);
    }
    loadBooks();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeRoute books={books} />} />
          <Route
            path="books"
            element={
              <ProtectedRoute>
                <Books
                  books={books}
                  setBooks={setBooks}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="add"
            element={
              <ProtectedRoute>
                <AddBook
                  setBooks={setBooks}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit/:id"
            element={
              <ProtectedRoute>
                <EditBook
                  books={books}
                  setBooks={setBooks}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="books/:id"
            element={
              <ProtectedRoute>
                <BookDetails
                  books={books}
                  setBooks={setBooks}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="stats"
            element={
              <ProtectedRoute>
                <Stats books={books} />
              </ProtectedRoute>
            }
          />
          <Route
            path="login"
            element={<Login />}
          />
          <Route
            path="register"
            element={<Register />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;