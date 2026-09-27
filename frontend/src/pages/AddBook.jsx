import { useNavigate } from "react-router-dom";
import BookForm from "../components/BookForm";
import { createBook } from "../api/books";

function AddBook({ books = [], setBooks }) {
  const navigate = useNavigate();

  async function handleAddBook(book) {
    const savedBook = await createBook(book);

    setBooks((currentBooks) => [
      ...currentBooks,
      savedBook,
    ]);

    navigate("/books");
  }

  return (
    <BookForm
      books={books}
      onSubmit={handleAddBook}
    />
  );
}

export default AddBook;