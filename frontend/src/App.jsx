import { useState } from "react";

import Home from "./pages/Home";
import Books from "./pages/Books";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";

import initialBooks from "./data/books";

function App() {
  const [books, setBooks] = useState(initialBooks);

  return (
    <div>
      <Home />

      <Books books={books} />

      <AddBook 
        books={books}
        setBooks={setBooks}
      />

      <EditBook />
    </div>
  );
}

export default App;