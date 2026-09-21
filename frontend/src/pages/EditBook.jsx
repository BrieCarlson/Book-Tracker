import {
  useState,
  useCallback,
  useEffect,
} from "react";
import BookForm from "../components/BookForm";
import {
  useNavigate,
  useParams,
  unstable_usePrompt as usePrompt,
  useBeforeUnload,
} from "react-router-dom";
import { updateBook } from "../api/books";

function EditBook({ books, setBooks }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [hasChanges, setHasChanges] = useState(false);
  const [shouldNavigateAfterSave, setShouldNavigateAfterSave] =
    useState(false);
  const [error, setError] = useState("");

  const editingBook = books.find(
    (book) => book._id === id
  );

  const shouldBlockNavigation = useCallback(
    ({ currentLocation, nextLocation }) => {
      if (!hasChanges) {
        return false;
      }

      return (
        currentLocation.pathname !== nextLocation.pathname ||
        currentLocation.search !== nextLocation.search ||
        currentLocation.hash !== nextLocation.hash
      );
    },
    [hasChanges]
  );

  usePrompt({
    when: shouldBlockNavigation,
    message:
      "You have unsaved changes. Are you sure you want to leave?",
  });

  useBeforeUnload(
    useCallback(
      (event) => {
        if (!hasChanges) {
          return;
        }

        event.preventDefault();
        event.returnValue = "";
      },
      [hasChanges]
    )
  );

  useEffect(() => {
    if (!shouldNavigateAfterSave || hasChanges) {
      return;
    }

    navigate("/books");
  }, [
    shouldNavigateAfterSave,
    hasChanges,
    navigate,
  ]);

  function handleBack() {
    navigate("/books");
  }

  if (!editingBook) {
    return <p>Book not found.</p>;
  }

  async function handleEditBook(updatedBook) {
    setError("");

    try {
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

      setHasChanges(false);
      setShouldNavigateAfterSave(true);
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  }

  return (
    <div>
      <button onClick={handleBack}>
        ← Back to Books
      </button>

      <h1>Edit Book</h1>

      {error && <p>{error}</p>}

      <BookForm
        book={editingBook}
        onSubmit={handleEditBook}
        setHasChanges={setHasChanges}
      />
    </div>
  );
}

export default EditBook;
