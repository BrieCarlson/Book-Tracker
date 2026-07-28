import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookCard.css";

function BookCard({ book }) {
  const navigate = useNavigate();

  const [summaryExpanded, setSummaryExpanded] = useState(false);

  const summaryLimit = 150;
  const summary = book?.summary || "";
  const hasSummary = Boolean(summary);
  const isLongSummary = hasSummary && summary.length > summaryLimit;

  const displayedText =
    summaryExpanded || !isLongSummary
      ? summary
      : `${summary.substring(0, summaryLimit)}...`;

  function renderStars(rating = 0) {
    return (
      <>
        {"★".repeat(rating)}
        {"☆".repeat(5 - rating)}
      </>
    );
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
          <span
            className={`status-badge ${book.status
              .toLowerCase()
              .replaceAll(" ", "-")}`}
          >
            {book.status}
          </span>
        </p>

        <p>
          Rating:{" "}
          <span className="rating-stars">
            {renderStars(book.rating)}
          </span>
        </p>

        <p>
          Date Started:{" "}
          {book.dateStarted
            ? new Date(`${book.dateStarted}T00:00:00`).toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )
            : "N/A"}
        </p>

        <p>
          Date Finished:{" "}
          {book.dateFinished
            ? new Date(`${book.dateFinished}T00:00:00`).toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )
            : "N/A"}
        </p>
      </div>

      <div className="book-summary">
        <h3>Summary</h3>

        <p>
          {hasSummary
            ? displayedText
            : "No summary added."}
        </p>

        {isLongSummary && (
          <button
            onClick={() =>
              setSummaryExpanded(!summaryExpanded)
            }
          >
            {summaryExpanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      <div className="book-actions">
        <button
          onClick={() => navigate(`/books/${book.id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default BookCard;