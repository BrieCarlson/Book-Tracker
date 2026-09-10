import { useNavigate } from "react-router-dom";
import "./BookCard.css";

function BookCard({ book }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/books/${book._id}`);
  }

  const statusClass = book.status
    .toLowerCase()
    .replaceAll(" ", "-");

  return (
    <div
      className="book-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          handleClick();
        }
      }}
    >
      {book.coverImage ? (
        <img
          src={book.coverImage}
          alt={`${book.title} cover`}
          className="book-cover"
        />
      ) : (
        <div className="book-cover-placeholder">
          No Cover
        </div>
      )}

      <div className="book-card-info">
        <h2>{book.title}</h2>
        <p>{book.author}</p>

        <span className={`status-badge ${statusClass}`}>
          {book.status}
        </span>
      </div>
    </div>
  );
}

export default BookCard;