import BookForm from "../components/BookForm";
import { useNavigate } from "react-router-dom";

function AddBook({ setBooks }) {
  const navigate = useNavigate();

  function handleAddBook(book) {
    const now = new Date().toISOString();
    const newBook = {
      id: Date.now(),
      dateAdded: now,
      lastUpdated: now,
      ...book,
    };

    setBooks((currentBooks) => [
      ...currentBooks,
      newBook,
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