import { useState } from "react";

import Home from "./pages/Home";
import Books from "./pages/Books";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";

import initialBooks from "./data/books";

function App() {
  const [books, setBooks] = useState(initialBooks);
  const [editingBook, setEditingBook] = useState(null);

  return (
    <div>
      <Home />

      <Books 
        books={books}
        setBooks={setBooks}
        setEditingBook={setEditingBook}
      />

      <AddBook setBooks={setBooks} />

      <EditBook 
        editingBook={editingBook}
        books={books}
        setBooks={setBooks}
        setEditingBook={setEditingBook}
      />
    </div>
  );
}

export default App;