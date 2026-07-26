import { useState, useEffect } from "react";
import "./BookForm.css";

function BookForm({ onSubmit, book }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("Want To Read");
  const [rating, setRating] = useState(0);
  const [summary, setSummary] = useState("");
  const [notes, setNotes] = useState("");
  const [dateStarted, setDateStarted] = useState("");
  const [dateFinished, setDateFinished] = useState("");
  const [coverImage, setCoverImage] = useState("");

  useEffect(() => {
    if (book) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(book.title);
      setAuthor(book.author);
      setStatus(book.status);
      setRating(book.rating);
      setSummary(book.summary);
      setNotes(book.notes);
      setDateStarted(book.dateStarted);
      setDateFinished(book.dateFinished);
      setCoverImage(book.coverImage || "");
    }
  }, [book]);

  function handleSubmit(event) {
    event.preventDefault();

    const bookData = {
      title,
      author,
      status,
      rating,
      summary,
      notes,
      dateStarted,
      dateFinished,
      coverImage,
    };

    onSubmit(bookData);
  }

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <h1>{book ? "Edit Book" : "Add Book"}</h1>

      <section className="form-section">
        <h2>Book Information</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <input
          placeholder="Author"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
        />

        <input
          placeholder="Cover Image URL"
          value={coverImage}
          onChange={(event) => setCoverImage(event.target.value)}
        />
      </section>

      <section className="form-section">
        <h2>Reading Details</h2>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="Want To Read">Want To Read</option>
          <option value="Reading">Reading</option>
          <option value="Finished">Finished</option>
          <option value="Did Not Finish">Did Not Finish</option>
        </select>

        <select
          value={rating}
          onChange={(event) => setRating(Number(event.target.value))}
        >
          <option value={0}>No Rating</option>
          <option value={1}>1 Star</option>
          <option value={2}>2 Stars</option>
          <option value={3}>3 Stars</option>
          <option value={4}>4 Stars</option>
          <option value={5}>5 Stars</option>
        </select>
      </section>

      <section className="form-section">
        <h2>Dates</h2>

        <div className="date-group">
          <label htmlFor="dateStarted">Date Started:</label>
          <input
            id="dateStarted"
            type="date"
            value={dateStarted}
            onChange={(event) => setDateStarted(event.target.value)}
          />
        </div>

        <div className="date-group">
          <label htmlFor="dateFinished">Date Finished:</label>
          <input
            id="dateFinished"
            type="date"
            value={dateFinished}
            onChange={(event) => setDateFinished(event.target.value)}
          />
        </div>
      </section>

      <section className="form-section">
        <h2>Summary</h2>

        <textarea
          placeholder="Enter book summary here..."
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
        />
      </section>

      <section className="form-section">
        <h2>Notes</h2>

        <textarea
          placeholder="Add notes here..."
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </section>

      <button type="submit">
        {book ? "Save Changes" : "Add Book"}
      </button>
    </form>
  );
}

export default BookForm;