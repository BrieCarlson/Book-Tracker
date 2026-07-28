import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Books from "./pages/Books";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import initialBooks from "./data/books";
import Layout from "./components/Layout";
import Stats from "./pages/Stats";
import BookDetails from "./pages/BookDetails";

function App() {
  // Do I already have saved books? If yes, load them, otherwise load sample data
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem("books");

    if (savedBooks) {
      return JSON.parse(savedBooks);
    }

    return initialBooks;
  });

  // Whenever books changes, save it.
  useEffect(() => {
    localStorage.setItem(
      "books",
      JSON.stringify(books)
    );
  }, [books]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home books={books} />} />
          <Route
            path="books"
            element={
              <Books
                books={books}
                setBooks={setBooks}
              />
            }
          />
          <Route
            path="add"
            element={
              <AddBook
                setBooks={setBooks}
              />
            }
          />
          <Route
            path="edit/:id"
            element={
              <EditBook
                books={books}
                setBooks={setBooks}
              />
            }
          />
          <Route
            path="books/:id"
            element={
              <BookDetails
                books={books}
                setBooks={setBooks}
              />
            }
          />
          <Route
            path="stats"
            element={<Stats books={books} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;