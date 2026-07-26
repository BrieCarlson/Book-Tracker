import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookCard.css";

function BookCard({ book, setBooks }) {
  const navigate = useNavigate();
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [notesExpanded, setNotesExpanded] = useState(false);
  const summaryLimit = 150;
  const notesLimit = 150;
  const summary = book?.summary || "";
  const notes = book?.notes || "";
  const hasSummary = Boolean(summary);
  const isLongSummary = hasSummary && summary.length > summaryLimit;
  const shouldShowFullText = summaryExpanded || !isLongSummary;
  const displayedText = hasSummary
    ? shouldShowFullText
      ? summary
      : `${summary.substring(0, summaryLimit)}...`
    : "No summary added.";
  const hasNotes = Boolean(notes);
  const isLongNotes = hasNotes && notes.length > notesLimit;
  const shouldShowFullNotes = notesExpanded || !isLongNotes;
  const displayedNotes = hasNotes
    ? shouldShowFullNotes
      ? notes
      : `${notes.substring(0, notesLimit)}...`
    : "No notes added.";

    function renderStars(rating = 0) {
      return (
        <>
          {"★".repeat(rating)}
          {"☆".repeat(5 - rating)}
        </>
      );
    }
    function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${book.title}"?`
    );
    if (confirmed) {
      setBooks((currentBooks) =>
        currentBooks.filter((currentBook) => currentBook.id !== book.id)
      );
    }
  }

  return (
    <div className="book-card">
      <div className="book-header">
        {book.coverImage && (
          <img
            src={book.coverImage}
            alt={`${book.title} cover`}
            className="book-cover"
          />
        )}

        <div className="book-header-info">
          <h2>{book.title}</h2>
          <p>{book.author}</p>
        </div>
      </div>
      
      <div className="book-status">
        <p>
          Status:{" "}
          <span className={`status-badge ${book.status.toLowerCase().replaceAll(" ", "-")}`}>
            {book.status}
          </span>
        </p>
        <p>
          Rating: <span className="rating-stars">{renderStars(book.rating)}</span>
        </p>
        <p>
          Date Started:{" "}
          {book.dateStarted
            ? new Date(`${book.dateStarted}T00:00:00`).toLocaleDateString(
                "en-US",
                { month: "long", day: "numeric", year: "numeric" }
              )
            : "N/A"}
        </p>
        <p>
          Date Finished:{" "}
          {book.dateFinished
            ? new Date(`${book.dateFinished}T00:00:00`).toLocaleDateString(
                "en-US",
                { month: "long", day: "numeric", year: "numeric" }
              )
            : "N/A"}
        </p>
      </div>

      <div className="book-summary">
        <h3>Summary</h3>
        <p>{displayedText}</p>
        {isLongSummary && (
          <button onClick={() => setSummaryExpanded(!summaryExpanded)}>
            {summaryExpanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      <div className="book-notes">
        <h3>Notes</h3>
        <p>{displayedNotes}</p>
        {isLongNotes && (
          <button onClick={() => setNotesExpanded(!notesExpanded)}>
            {notesExpanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      <div className="book-actions">
        <button onClick={() => navigate(`/edit/${book.id}`)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}

export default BookCard;
