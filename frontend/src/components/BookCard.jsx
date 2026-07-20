import { useNavigate } from "react-router-dom";

function BookCard({ book, setBooks }) {
  const navigate = useNavigate();

  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${book.title}"?`
    )
      if(confirmed) {
      setBooks((currentBooks) =>
        currentBooks.filter((currentBook) => currentBook.id !== book.id)
      );
    }
  }
  return (
    <div>
      <h2>{book.title}</h2>
      <p>{book.author}</p>
      <p>Status: {book.status}</p>
      <p>Rating: {book.rating} / 5</p>
      <p>Summary: {book.summary} </p>
      <p>Notes: {book.notes} </p>
      <p>
        Date Started:{" "}
        {book.dateStarted
          ? new Date(`${book.dateStarted}T00:00:00`).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : "N/A"}
      </p>
      <p>
        Date Finished:{" "}
        {book.dateFinished
          ? new Date(`${book.dateFinished}T00:00:00`).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : "N/A"}
      </p>
        <button onClick={() => navigate(`/edit/${book.id}`)}>
          Edit
        </button>
        <button onClick={handleDelete}>
          Delete
        </button>
    </div>
  );
}

export default BookCard;