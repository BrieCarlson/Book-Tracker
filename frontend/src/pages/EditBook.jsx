import { useNavigate, useParams } from "react-router-dom";
import BookForm from "../components/BookForm";
import { updateBook } from "../api/books";

function EditBook({ books = [], setBooks }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const editingBook = books.find(
    (book) => book._id === id
  );

  if (!editingBook) {
    return <p>Book not found.</p>;
  }

  async function handleEditBook(updatedBook) {
    const savedBook = await updateBook(
      editingBook._id,
      updatedBook
    );

    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book._id === savedBook._id
          ? savedBook
          : book
      )
    );

    navigate(`/books/${savedBook._id}`);
  }

  return (
    <BookForm
      book={editingBook}
      books={books}
      onSubmit={handleEditBook}
    />
  );
}

export default EditBook;