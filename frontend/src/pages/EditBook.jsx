import BookForm from "../components/BookForm";
import { useNavigate, useParams } from "react-router-dom";

function EditBook({ books, setBooks }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const editingBook = books.find(
    (book) => book.id === Number(id)
  );

  if (!editingBook) {
    return null;
  }

  function handleEditBook(updatedBook) {
    const updatedBooks = books.map((book) => {
      if (book.id === editingBook.id) {
        return {
          ...book,
          ...updatedBook,
        };
      }

      return book;
    });

    setBooks(updatedBooks);
    navigate("/books");
  }

  return (
    <div>
      <h1>Edit Book</h1>

      <BookForm
        book={editingBook}
        onSubmit={handleEditBook}
      />
    </div>
  );
}

export default EditBook;