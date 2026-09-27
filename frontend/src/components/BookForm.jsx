import { useState, useEffect } from "react";
import BookLookup from "./BookLookup";
import "./BookForm.css";

function BookForm({
  onSubmit,
  book,
  books = [],
  setHasChanges,
}) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [genre, setGenre] = useState("");
  const [series, setSeries] = useState("");
  const [pages, setPages] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publicationDate, setPublicationDate] =
    useState("");
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
      setTitle(book.title || "");
      setAuthor(book.author || "");
      setIsbn(book.isbn || "");
      setGenre(book.genre || "");
      setSeries(book.series || "");
      setPages(
        book.pages !== null &&
          book.pages !== undefined
          ? String(book.pages)
          : ""
      );
      setPublisher(book.publisher || "");
      setPublicationDate(
        book.publicationDate || ""
      );
      setStatus(
        book.status || "Want To Read"
      );
      setRating(book.rating || 0);
      setSummary(book.summary || "");
      setNotes(book.notes || "");
      setDateStarted(book.dateStarted || "");
      setDateFinished(book.dateFinished || "");
      setCoverImage(book.coverImage || "");
    }
  }, [book]);

  const existingGenres = [
    ...new Set(
      books
        .flatMap((currentBook) =>
          String(currentBook.genre || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        )
    ),
  ].sort((a, b) => a.localeCompare(b));

  const existingSeries = [
    ...new Set(
      books
        .flatMap((currentBook) =>
          String(currentBook.series || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        )
    ),
  ].sort((a, b) => a.localeCompare(b));

  function markAsChanged() {
    if (setHasChanges) {
      setHasChanges(true);
    }
  }

  function handleChange(setter) {
    return (event) => {
      setter(event.target.value);
      markAsChanged();
    };
  }

  function handleBookSelect(selectedBook) {
    setTitle(selectedBook.title || "");
    setAuthor(selectedBook.author || "");
    setIsbn(selectedBook.isbn || "");
    setGenre(selectedBook.genre || "");
    setSeries(selectedBook.series || "");
    setPages(
      selectedBook.pages !== null &&
        selectedBook.pages !== undefined
        ? String(selectedBook.pages)
        : ""
    );
    setPublisher(selectedBook.publisher || "");
    setPublicationDate(
      selectedBook.publicationDate || ""
    );
    setCoverImage(
      selectedBook.coverImage || ""
    );

    markAsChanged();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanAuthor = author.trim();
    const missingFields = [];

    if (!cleanTitle) {
      missingFields.push("title");
    }

    if (!cleanAuthor) {
      missingFields.push("author");
    }

    if (missingFields.length > 0) {
      const shouldSaveAsUnknown =
        window.confirm(
          `This book is missing its ${missingFields.join(
            " and "
          )}. Save it as Unknown instead?`
        );

      if (!shouldSaveAsUnknown) {
        return;
      }
    }

    const cleanPages = pages
      ? Number.parseInt(pages, 10)
      : null;

    const bookData = {
      title:
        cleanTitle || "Unknown Title",
      author:
        cleanAuthor || "Unknown Author",
      isbn: isbn.trim(),
      genre: genre.trim(),
      series: series.trim(),
      pages:
        Number.isFinite(cleanPages) &&
        cleanPages > 0
          ? cleanPages
          : null,
      publisher: publisher.trim(),
      publicationDate:
        publicationDate.trim(),
      status,
      rating,
      summary,
      notes,
      dateStarted,
      dateFinished,
      coverImage,
    };

    try {
      await onSubmit(bookData);

      if (setHasChanges) {
        setHasChanges(false);
      }
    } catch {
      if (setHasChanges) {
        setHasChanges(true);
      }
    }
  }

  return (
    <form
      className="book-form"
      onSubmit={handleSubmit}
    >
      <h1>{book ? "Edit Book" : "Add Book"}</h1>

      <section className="form-section">
        <h2>Book Information</h2>

        <BookLookup
          onSelect={handleBookSelect}
        />

        <p className="book-form-help">
          Search for a book above, or enter the
          information manually.
        </p>

        <input
          placeholder="Title"
          value={title}
          onChange={handleChange(setTitle)}
        />

        <input
          placeholder="Author"
          value={author}
          onChange={handleChange(setAuthor)}
        />

        <label htmlFor="genre">
          Genre
        </label>

        <input
          id="genre"
          list="existing-genres"
          placeholder="Genre"
          value={genre}
          onChange={handleChange(setGenre)}
          autoComplete="off"
        />

        <datalist id="existing-genres">
          {existingGenres.map((existingGenre) => (
            <option
              key={existingGenre}
              value={existingGenre}
            />
          ))}
        </datalist>

        <label htmlFor="series">
          Series
        </label>

        <input
          id="series"
          list="existing-series"
          placeholder="Series"
          value={series}
          onChange={handleChange(setSeries)}
          autoComplete="off"
        />

        <datalist id="existing-series">
          {existingSeries.map((existingSeriesName) => (
            <option
              key={existingSeriesName}
              value={existingSeriesName}
            />
          ))}
        </datalist>

        <input
          placeholder="ISBN"
          value={isbn}
          onChange={handleChange(setIsbn)}
        />

        <input
          type="number"
          min="1"
          placeholder="Page Count"
          value={pages}
          onChange={handleChange(setPages)}
        />

        <input
          placeholder="Publisher"
          value={publisher}
          onChange={handleChange(setPublisher)}
        />

        <input
          placeholder="Publication Date"
          value={publicationDate}
          onChange={handleChange(
            setPublicationDate
          )}
        />

        <input
          placeholder="Cover Image URL"
          value={coverImage}
          onChange={handleChange(
            setCoverImage
          )}
        />
      </section>

      <section className="form-section">
        <h2>Reading Details</h2>

        <select
          value={status}
          onChange={handleChange(setStatus)}
        >
          <option value="Want To Read">
            Want To Read
          </option>
          <option value="Reading">
            Reading
          </option>
          <option value="Finished">
            Finished
          </option>
          <option value="Did Not Finish">
            Did Not Finish
          </option>
        </select>

        <select
          value={rating}
          onChange={(event) => {
            setRating(
              Number(event.target.value)
            );
            markAsChanged();
          }}
        >
          <option value={0}>
            No Rating
          </option>
          <option value={1}>
            1 Star
          </option>
          <option value={2}>
            2 Stars
          </option>
          <option value={3}>
            3 Stars
          </option>
          <option value={4}>
            4 Stars
          </option>
          <option value={5}>
            5 Stars
          </option>
        </select>
      </section>

      <section className="form-section">
        <h2>Dates</h2>

        <div className="date-group">
          <label htmlFor="dateStarted">
            Date Started:
          </label>

          <input
            id="dateStarted"
            type="date"
            value={dateStarted}
            onChange={handleChange(
              setDateStarted
            )}
          />
        </div>

        <div className="date-group">
          <label htmlFor="dateFinished">
            Date Finished:
          </label>

          <input
            id="dateFinished"
            type="date"
            value={dateFinished}
            onChange={handleChange(
              setDateFinished
            )}
          />
        </div>
      </section>

      <section className="form-section">
        <h2>Summary</h2>

        <textarea
          placeholder="Enter book summary here..."
          value={summary}
          onChange={handleChange(setSummary)}
        />
      </section>

      <section className="form-section">
        <h2>Notes</h2>

        <textarea
          placeholder="Add notes here..."
          value={notes}
          onChange={handleChange(setNotes)}
        />
      </section>

      <button type="submit">
        {book ? "Save Changes" : "Add Book"}
      </button>
    </form>
  );
}

export default BookForm;