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

  const summary = book.summary?.trim() || "";
  const notes = book.notes?.trim() || "";

  const hasRating = Number(book.rating) > 0;
  const hasDateStarted = Boolean(book.dateStarted);
  const hasDateFinished = Boolean(book.dateFinished);

  const hasGenre = Boolean(book.genre?.trim());
  const hasSeries = Boolean(book.series?.trim());
  const hasIsbn = Boolean(book.isbn?.trim());
  const hasPages = Number(book.pages) > 0;
  const hasPublisher = Boolean(book.publisher?.trim());
  const hasPublicationDate = Boolean(
    book.publicationDate?.trim()
  );

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
          (currentBook) =>
            currentBook._id !== book._id
        )
      );

      navigate("/books");
    }
  }

  return (
    <div className="book-details">
      <div className="details-back">
        <button
          type="button"
          onClick={() => navigate("/books")}
        >
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

      <section className="details-section book-information">
        <h3>Book Information</h3>

        {hasGenre && (
          <p>
            <strong>Genre:</strong>{" "}
            {book.genre}
          </p>
        )}

        {hasSeries && (
          <p>
            <strong>Series:</strong>{" "}
            {book.series}
          </p>
        )}

        {hasIsbn && (
          <p>
            <strong>ISBN:</strong>{" "}
            {book.isbn}
          </p>
        )}

        {hasPages && (
          <p>
            <strong>Pages:</strong>{" "}
            {book.pages}
          </p>
        )}

        {hasPublisher && (
          <p>
            <strong>Publisher:</strong>{" "}
            {book.publisher}
          </p>
        )}

        {hasPublicationDate && (
          <p>
            <strong>Publication Date:</strong>{" "}
            {book.publicationDate}
          </p>
        )}

        {!hasGenre &&
          !hasSeries &&
          !hasIsbn &&
          !hasPages &&
          !hasPublisher &&
          !hasPublicationDate && (
            <p className="details-empty">
              No additional book information
              has been added.
            </p>
          )}
      </section>

      <section className="details-section reading-details">
        <h3>Reading Information</h3>

        <p>
          <strong>Status:</strong>{" "}
          {book.status}
        </p>

        {hasRating && (
          <p>
            <strong>Rating:</strong>{" "}
            {book.rating}/5
          </p>
        )}

        {hasDateStarted && (
          <p>
            <strong>Date Started:</strong>{" "}
            {formatDate(book.dateStarted)}
          </p>
        )}

        {hasDateFinished && (
          <p>
            <strong>Date Finished:</strong>{" "}
            {formatDate(book.dateFinished)}
          </p>
        )}

        <p>
          <strong>Date Added:</strong>{" "}
          {formatDateTime(book.dateAdded)}
        </p>

        <p>
          <strong>Last Updated:</strong>{" "}
          {formatDateTime(
            book.updatedAt || book.createdAt
          )}
        </p>
      </section>

      {summary && (
        <section className="details-section">
          <h3>Summary</h3>

          <p className="details-text">
            {displayedSummary}
          </p>

          {summaryIsLong && (
            <button
              type="button"
              onClick={() =>
                setSummaryExpanded(
                  !summaryExpanded
                )
              }
            >
              {summaryExpanded
                ? "Show Less"
                : "Show More"}
            </button>
          )}
        </section>
      )}

      {notes && (
        <section className="details-section">
          <h3>Notes</h3>

          <p className="details-text">
            {displayedNotes}
          </p>

          {notesIsLong && (
            <button
              type="button"
              onClick={() =>
                setNotesExpanded(
                  !notesExpanded
                )
              }
            >
              {notesExpanded
                ? "Show Less"
                : "Show More"}
            </button>
          )}
        </section>
      )}

      <div className="details-actions">
        <button
          type="button"
          onClick={() =>
            navigate(`/edit/${book._id}`)
          }
        >
          Edit
        </button>

        <button
          type="button"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default BookDetails;