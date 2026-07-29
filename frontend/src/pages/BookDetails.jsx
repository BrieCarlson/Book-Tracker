import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteBook } from "../api/books";
import { formatDate, formatDateTime } from "../utils/formatDate";
import "./BookDetails.css";

function BookDetails({ books, setBooks }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [notesExpanded, setNotesExpanded] = useState(false);

  const book = books.find(
    (book) => book._id === id
  );

  if (!book) {
    return <p>Book not found.</p>;
  }

  const summaryLimit = 200;
  const notesLimit = 200;
  const summary = book.summary || "";
  const notes = book.notes || "";
  const summaryIsLong = summary.length > summaryLimit;
  const notesIsLong = notes.length > notesLimit;
  const displayedSummary =
    summaryExpanded || !summaryIsLong
      ? summary
      : `${summary.substring(0, summaryLimit)}...`;

  const displayedNotes =
    notesExpanded || !notesIsLong
      ? notes
      : `${notes.substring(0, notesLimit)}...`;

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${book.title}"?`
    );

    if (confirmed) {
      await deleteBook(book._id);

      setBooks((currentBooks) =>
        currentBooks.filter(
          (currentBook) => currentBook._id !== book._id
        )
      );

      navigate("/books");
    }
  }

  return (
    <div className="book-details">
        <div className="details-back">
            <button onClick={() => navigate("/books")}>
                ←
            </button>
        </div>
        <div className="details-header">
        {book.coverImage && (
            <img
            src={book.coverImage}
            alt={`${book.title} cover`}
            className="details-cover"
            />
        )}

        <div className="details-title">
            <h1>{book.title}</h1>
            <h2>{book.author}</h2>
        </div>
      </div>

      <section className="details-section reading-details">
        <h3>Reading Information</h3>
        <p>
          Status: {book.status}
        </p>
        <p>
          Rating: {book.rating}/5
        </p>
        <p>
          Date Started: {formatDate(book.dateStarted)}
        </p>
        <p>
          Date Finished: {formatDate(book.dateFinished)}
        </p>
        <p>
          <strong>Date Added:</strong>{" "}
          {formatDateTime(book.dateAdded)}
        </p>

        <p>
          <strong>Last Updated:</strong>{" "}
          {formatDateTime(book.updatedAt || book.createdAt)}
        </p>
      </section>

      <section className="details-section">
        <h3>Summary</h3>
        <p className="details-text">
          {summary
              ? displayedSummary
              : "No summary added."}
        </p>

        {summaryIsLong && (
          <button
            onClick={() =>
              setSummaryExpanded(!summaryExpanded)
            }
          >
            {summaryExpanded
              ? "Show Less"
              : "Show More"}
          </button>
        )}
      </section>

      <section className="details-section">
        <h3>Notes</h3>
        <p className="details-text">
          {notes
            ? displayedNotes
            : "No notes added."}
        </p>

        {notesIsLong && (
          <button
            onClick={() =>
              setNotesExpanded(!notesExpanded)
            }
          >
            {notesExpanded
              ? "Show Less"
              : "Show More"}
          </button>
        )}
      </section>

      <div className="details-actions">
        <button
          onClick={() =>
            navigate(`/edit/${book._id}`)
          }
        >
          Edit
        </button>

        <button onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default BookDetails;