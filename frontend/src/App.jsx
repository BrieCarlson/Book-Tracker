import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ConfirmEmailChange from "./pages/ConfirmEmailChange";

import Books from "./pages/Books";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import Layout from "./components/Layout";
import Stats from "./pages/Stats";
import BookDetails from "./pages/BookDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeRoute from "./components/HomeRoute";
import Profile from "./pages/Profile";
import { useAuth } from "./hooks/useAuth";

import { getBooks } from "./api/books";

function App() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  useEffect(() => {
    async function loadBooks() {
      if (!user) {
        setBooks([]);
        return;
      }
      const savedBooks = await getBooks();

      if (Array.isArray(savedBooks)) {
        setBooks(savedBooks);
      } else {
        setBooks([]);
      }
    }
    loadBooks();
  }, [user]);

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
          <Route
            path="confirm-email-change"
            element={<ConfirmEmailChange />}
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;