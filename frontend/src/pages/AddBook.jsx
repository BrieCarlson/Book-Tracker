import { useState } from "react";
import BookForm from "../components/BookForm";
import { useNavigate } from "react-router-dom";
import { createBook } from "../api/books";

function AddBook({ setBooks }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleAddBook(book) {
    setError("");

    try {
      const savedBook = await createBook(book);

      setBooks((currentBooks) => [
        ...currentBooks,
        savedBook,
      ]);

      navigate("/books");
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  }

  return (
    <div>
      <h1>Add Book</h1>

      {error && <p>{error}</p>}

      <BookForm onSubmit={handleAddBook} />
    </div>
  );
}

export default AddBook;