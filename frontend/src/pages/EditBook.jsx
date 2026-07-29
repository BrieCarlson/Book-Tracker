import BookForm from "../components/BookForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function EditBook({ books, setBooks }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [hasChanges, setHasChanges] = useState(false);

  const editingBook = books.find(
    (book) => book.id === Number(id)
  );

  useEffect(() => {
    function handleBeforeUnload(event) {
      if (hasChanges) {
        event.preventDefault();
        event.returnValue = "";
      }
    }

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [hasChanges]);

  function handleBack() {
    if (hasChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );

      if (!confirmed) {
        return;
      }
    }

    navigate("/books");
  }

  if (!editingBook) {
    return null;
  }

  function handleEditBook(updatedBook) {
    const updatedBooks = books.map((book) => {
      if (book.id === editingBook.id) {
        return {
          ...book,
          ...updatedBook,
          lastUpdated: new Date().toISOString(),
        };
      }

      return book;
    });

    setBooks(updatedBooks);
    setHasChanges(false);
    navigate("/books");
  }

  return (
    <div>
      <button onClick={handleBack}>
        ← Back to Books
      </button>

      <h1>Edit Book</h1>

      <BookForm
        book={editingBook}
        onSubmit={handleEditBook}
        setHasChanges={setHasChanges}
      />
    </div>
  );
}

export default EditBook;