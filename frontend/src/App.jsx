import { useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
} from "react-router-dom";

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
import ScrollToTop from "./components/ScrollToTop";

function AppRoutes() {
  const {
    user,
    authLoading,
  } = useAuth();

  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function loadBooks() {
      if (!user) {
        setBooks([]);
        return;
      }

      try {
        const savedBooks = await getBooks();

        if (Array.isArray(savedBooks)) {
          setBooks(savedBooks);
        } else {
          setBooks([]);
        }
      } catch (error) {
        console.error(
          "Failed to load books:",
          error.message
        );
        setBooks([]);
      }
    }

    if (!authLoading) {
      loadBooks();
    }
  }, [user, authLoading]);

  if (authLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={<HomeRoute books={books} />}
        />

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
              <AddBook setBooks={setBooks} />
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
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "*",
    element: <AppRoutes />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;