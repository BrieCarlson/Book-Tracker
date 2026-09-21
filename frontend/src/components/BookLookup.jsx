import { useEffect, useRef, useState } from "react";
import { searchBooks } from "../api/bookSearch";
import "./BookLookup.css";

function BookLookup({ onSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  const skipNextSearch = useRef(false);

  useEffect(() => {
    const cleanQuery = query.trim();
    const controller = new AbortController();

    const searchDelay = window.setTimeout(
      async () => {
        if (skipNextSearch.current) {
          skipNextSearch.current = false;
          setSuggestions([]);
          setHasSearched(false);
          setLoading(false);
          return;
        }

        if (cleanQuery.length < 2) {
          setSuggestions([]);
          setHasSearched(false);
          setLoading(false);
          setError("");
          return;
        }

        setLoading(true);
        setError("");
        setIsOpen(true);

        try {
          const results = await searchBooks(
            cleanQuery,
            controller.signal
          );

          if (controller.signal.aborted) {
            return;
          }

          setSuggestions(results);
          setHasSearched(true);
        } catch (requestError) {
          if (requestError.name === "AbortError") {
            return;
          }

          setSuggestions([]);
          setHasSearched(true);
          setError(requestError.message);
        } finally {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        }
      },
      cleanQuery.length < 2 ? 0 : 400
    );

    return () => {
      window.clearTimeout(searchDelay);
      controller.abort();
    };
  }, [query]);

  function handleSelect(book) {
    skipNextSearch.current = true;

    setQuery(book.title || "");
    setSuggestions([]);
    setHasSearched(false);
    setIsOpen(false);
    setError("");

    onSelect(book);
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div className="book-lookup">
      <label
        htmlFor="book-lookup-input"
        className="book-lookup-label"
      >
        Find a book
      </label>

      <input
        id="book-lookup-input"
        type="search"
        placeholder="Start typing a title or author..."
        value={query}
        autoComplete="off"
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          if (suggestions.length > 0) {
            setIsOpen(true);
          }
        }}
        onBlur={() => {
          window.setTimeout(() => {
            setIsOpen(false);
          }, 150);
        }}
        onKeyDown={handleKeyDown}
      />

      {isOpen && (loading || error || hasSearched) && (
        <div className="book-lookup-results">
          {loading && (
            <p className="book-lookup-message">
              Searching...
            </p>
          )}

          {!loading && error && (
            <p className="book-lookup-message book-lookup-error">
              {error}
            </p>
          )}

          {!loading &&
            !error &&
            hasSearched &&
            suggestions.length === 0 && (
              <p className="book-lookup-message">
                No matching books found.
              </p>
            )}

          {!loading &&
            !error &&
            suggestions.map((book, index) => (
              <button
                type="button"
                className="book-lookup-option"
                key={
                  book.externalId ||
                  `${book.title}-${book.author}-${index}`
                }
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                onClick={() => handleSelect(book)}
              >
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt=""
                    className="book-lookup-cover"
                  />
                ) : (
                  <div className="book-lookup-cover-placeholder">
                    No Cover
                  </div>
                )}

                <span className="book-lookup-details">
                  <strong>{book.title}</strong>
                  <span>{book.author}</span>

                  {book.publishedDate && (
                    <small>{book.publishedDate}</small>
                  )}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

export default BookLookup;
