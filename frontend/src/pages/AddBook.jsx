import BookForm from "../components/BookForm";
import { useNavigate } from "react-router-dom";
import { createBook } from "../api/books";

function AddBook({ setBooks }) {
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
    <div>
      <h1>Add Book</h1>

      <BookForm onSubmit={handleAddBook} />
    </div>
  );
}

export default AddBook;