import { useState, useEffect } from "react";

function BookForm( { onSubmit, book }) {

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("Want To Read");
  const [rating, setRating] = useState(0);
  const [summary, setSummary] = useState("");
  const [notes, setNotes] = useState("");
  const [dateStarted, setDateStarted] = useState("");
  const [dateFinished, setDateFinished] = useState("");

  useEffect(() => {
  if (book) {
    setTitle(book.title);
    setAuthor(book.author);
    setStatus(book.status);
    setRating(book.rating);
    setSummary(book.summary);
    setNotes(book.notes);
    setDateStarted(book.dateStarted);
    setDateFinished(book.dateFinished);
  }
}, [book]);

  function handleSubmit(event) {
    event.preventDefault();
    const book = {
      title,
      author,
      status,
      rating,
      summary,
      notes,
      dateStarted,
      dateFinished,
      coverImage: "",
    };

    onSubmit(book);
  }


  return (
    <form onSubmit={handleSubmit}>
      <h1>Book Form</h1>

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

      <div style={{ textAlign: "center", width: "100%" }}>
          <textarea
            placeholder="Enter book summary here..."
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            rows={5}
            cols={40}
            style={{ display: "inline-block", marginTop: "10px", resize: "vertical" }}
          />
        </div>

      <div style={{ textAlign: "center", width: "100%" }}>
          <textarea
            placeholder="Add notes here..."
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            cols={40}
            style={{ display: "inline-block", marginTop: "10px", resize: "vertical" }}
          />
        </div>
        <div style={{ display: "inline-block", textAlign: "left", width: "100%", maxWidth: "330px", marginTop: "15px" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <label htmlFor="dateStarted" style={{ fontSize: "14px" }}>Date Started:</label>
            <input 
              id="dateStarted"
              type="date" 
              value={dateStarted}
              onChange={(event) => setDateStarted(event.target.value)}
              style={{ width: "60%" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label htmlFor="dateFinished" style={{ fontSize: "14px" }}>Date Finished:</label>
            <input 
              id="dateFinished"
              type="date" 
              value={dateFinished}
              onChange={(event) => setDateFinished(event.target.value)}
              style={{ width: "60%" }}
            />
          </div>
        </div>

      <button type="submit">
        {book ? "Save Changes" : "Add Book"}
      </button>

    </form>

  );
}

export default BookForm;