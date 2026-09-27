import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";
import { useAuth } from "../hooks/useAuth";
import "./Books.css";

const statuses = [
  "Reading",
  "Want To Read",
  "Finished",
  "Did Not Finish",
];

const validSortOptions = [
  "newest",
  "oldest",
  "title-az",
  "title-za",
  "rating-high",
  "rating-low",
];

function getSavedSortOption(userId) {
  if (!userId) {
    return "newest";
  }

  const savedOption = localStorage.getItem(
    `book-tracker:sort:${userId}`
  );

  return validSortOptions.includes(savedOption)
    ? savedOption
    : "newest";
}

function getBookTitle(book) {
  return String(book?.title || "Unknown Title");
}

function getBookAuthor(book) {
  return String(book?.author || "Unknown Author");
}

function getBookGenres(book) {
  if (!book?.genre) {
    return [];
  }

  return String(book.genre)
    .split(",")
    .map((genre) => genre.trim())
    .filter(Boolean);
}

function Books({ books = [] }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userId = user?.id;

  const sortStorageKey = userId
    ? `book-tracker:sort:${userId}`
    : null;

  const [selectedStatuses, setSelectedStatuses] =
    useState([]);

  const [selectedGenres, setSelectedGenres] =
    useState([]);

  const [sortOption, setSortOption] = useState(() =>
    getSavedSortOption(userId)
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    if (sortStorageKey) {
      localStorage.setItem(
        sortStorageKey,
        sortOption
      );
    }
  }, [sortStorageKey, sortOption]);

  const safeBooks = Array.isArray(books)
    ? books
    : [];

  const availableGenres = [
    ...new Set(
      safeBooks
        .flatMap((book) => getBookGenres(book))
    ),
  ].sort((a, b) =>
    a.localeCompare(b)
  );

  const allStatusesSelected =
    selectedStatuses.length === 0;

  const allGenresSelected =
    selectedGenres.length === 0;

  const normalizedSearchTerm =
    searchTerm.trim().toLowerCase();

  function handleStatusChange(status) {
    setSelectedStatuses((current) => {
      if (current.includes(status)) {
        return current.filter(
          (item) => item !== status
        );
      }

      return [...current, status];
    });
  }

  function handleGenreChange(genre) {
    setSelectedGenres((current) => {
      if (current.includes(genre)) {
        return current.filter(
          (item) => item !== genre
        );
      }

      return [...current, genre];
    });
  }

  function clearFilters() {
    setSelectedStatuses([]);
    setSelectedGenres([]);
  }

  function clearSearch() {
    setSearchTerm("");
  }

  const activeFilterCount =
    selectedStatuses.length +
    selectedGenres.length;

  const filteredBooks = safeBooks.filter(
    (book) => {
      const matchesStatus =
        allStatusesSelected ||
        selectedStatuses.includes(book.status);

      const bookGenres = getBookGenres(book);

      const matchesGenre =
        allGenresSelected ||
        selectedGenres.some((genre) =>
          bookGenres.includes(genre)
        );

      const title =
        getBookTitle(book).toLowerCase();

      const author =
        getBookAuthor(book).toLowerCase();

      const matchesSearch =
        normalizedSearchTerm === "" ||
        title.includes(normalizedSearchTerm) ||
        author.includes(normalizedSearchTerm);

      return (
        matchesStatus &&
        matchesGenre &&
        matchesSearch
      );
    }
  );

  const sortedBooks = [...filteredBooks].sort(
    (a, b) => {
      const titleA = getBookTitle(a);
      const titleB = getBookTitle(b);

      switch (sortOption) {
        case "newest":
          return (
            new Date(b.dateAdded || 0) -
            new Date(a.dateAdded || 0)
          );

        case "oldest":
          return (
            new Date(a.dateAdded || 0) -
            new Date(b.dateAdded || 0)
          );

        case "title-az":
          return titleA.localeCompare(titleB);

        case "title-za":
          return titleB.localeCompare(titleA);

        case "rating-high":
          return (
            (b.rating || 0) -
              (a.rating || 0) ||
            titleA.localeCompare(titleB)
          );

        case "rating-low":
          return (
            (a.rating || 0) -
              (b.rating || 0) ||
            titleA.localeCompare(titleB)
          );

        default:
          return 0;
      }
    }
  );

  return (
    <div className="bookshelf-page">
      <div className="bookshelf-header">
        <div>
          <h1>My Books</h1>

          <p>
            Showing {sortedBooks.length} of{" "}
            {safeBooks.length} books
          </p>
        </div>

        <div className="bookshelf-actions">
          <div className="bookshelf-search">
            <input
              type="search"
              placeholder="Search title or author..."
              aria-label="Search books by title or author"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

            {searchTerm && (
              <button
                type="button"
                className="search-clear-button"
                onClick={clearSearch}
                aria-label="Clear search"
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <button
            type="button"
            className="add-book-button"
            onClick={() => navigate("/add")}
            aria-label="Add a book"
            title="Add a book"
          >
            +
          </button>

          <div className="bookshelf-controls">
            <div className="bookshelf-menu">
              <button
                type="button"
                className="menu-button"
                onClick={() => {
                  setFiltersOpen(
                    !filtersOpen
                  );
                  setSortOpen(false);
                }}
              >
                Filters

                {activeFilterCount > 0 && (
                  <span className="menu-count">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {filtersOpen && (
                <div className="menu-panel">
                  <div className="menu-panel-header">
                    <strong>
                      Filters
                    </strong>

                    {activeFilterCount >
                      0 && (
                      <button
                        type="button"
                        className="clear-button"
                        onClick={
                          clearFilters
                        }
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="filter-section">
                    <strong>
                      Filter by Status
                    </strong>

                    <label className="checkbox-option">
                      <input
                        type="checkbox"
                        checked={
                          allStatusesSelected
                        }
                        onChange={() =>
                          setSelectedStatuses(
                            []
                          )
                        }
                      />

                      <span>All</span>
                    </label>

                    {statuses.map(
                      (status) => (
                        <label
                          key={status}
                          className="checkbox-option"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStatuses.includes(
                              status
                            )}
                            onChange={() =>
                              handleStatusChange(
                                status
                              )
                            }
                          />

                          <span>
                            {status}
                          </span>
                        </label>
                      )
                    )}
                  </div>

                  <div className="filter-section">
                    <strong>
                      Filter by Genre
                    </strong>

                    {availableGenres.length >
                    0 ? (
                      <>
                        <label className="checkbox-option">
                          <input
                            type="checkbox"
                            checked={
                              allGenresSelected
                            }
                            onChange={() =>
                              setSelectedGenres(
                                []
                              )
                            }
                          />

                          <span>
                            All Genres
                          </span>
                        </label>

                        {availableGenres.map(
                          (genre) => (
                            <label
                              key={genre}
                              className="checkbox-option"
                            >
                              <input
                                type="checkbox"
                                checked={selectedGenres.includes(
                                  genre
                                )}
                                onChange={() =>
                                  handleGenreChange(
                                    genre
                                  )
                                }
                              />

                              <span>
                                {genre}
                              </span>
                            </label>
                          )
                        )}
                      </>
                    ) : (
                      <p className="filter-empty">
                        No genres available yet.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bookshelf-menu">
              <button
                type="button"
                className="menu-button"
                onClick={() => {
                  setSortOpen(!sortOpen);
                  setFiltersOpen(false);
                }}
              >
                Sort
              </button>

              {sortOpen && (
                <div className="menu-panel sort-panel">
                  <label className="sort-option">
                    <input
                      type="radio"
                      name="sort"
                      value="newest"
                      checked={
                        sortOption ===
                        "newest"
                      }
                      onChange={(event) =>
                        setSortOption(
                          event.target.value
                        )
                      }
                    />

                    <span>
                      Date Added: Newest First
                    </span>
                  </label>

                  <label className="sort-option">
                    <input
                      type="radio"
                      name="sort"
                      value="oldest"
                      checked={
                        sortOption ===
                        "oldest"
                      }
                      onChange={(event) =>
                        setSortOption(
                          event.target.value
                        )
                      }
                    />

                    <span>
                      Date Added: Oldest First
                    </span>
                  </label>

                  <label className="sort-option">
                    <input
                      type="radio"
                      name="sort"
                      value="title-az"
                      checked={
                        sortOption ===
                        "title-az"
                      }
                      onChange={(event) =>
                        setSortOption(
                          event.target.value
                        )
                      }
                    />

                    <span>
                      Title: A-Z
                    </span>
                  </label>

                  <label className="sort-option">
                    <input
                      type="radio"
                      name="sort"
                      value="title-za"
                      checked={
                        sortOption ===
                        "title-za"
                      }
                      onChange={(event) =>
                        setSortOption(
                          event.target.value
                        )
                      }
                    />

                    <span>
                      Title: Z-A
                    </span>
                  </label>

                  <label className="sort-option">
                    <input
                      type="radio"
                      name="sort"
                      value="rating-high"
                      checked={
                        sortOption ===
                        "rating-high"
                      }
                      onChange={(event) =>
                        setSortOption(
                          event.target.value
                        )
                      }
                    />

                    <span>
                      Rating: Highest First
                    </span>
                  </label>

                  <label className="sort-option">
                    <input
                      type="radio"
                      name="sort"
                      value="rating-low"
                      checked={
                        sortOption ===
                        "rating-low"
                      }
                      onChange={(event) =>
                        setSortOption(
                          event.target.value
                        )
                      }
                    />

                    <span>
                      Rating: Lowest First
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {sortedBooks.length > 0 ? (
        <div className="bookshelf-grid">
          {sortedBooks.map((book) => (
            <BookCard
              key={book._id}
              book={book}
            />
          ))}
        </div>
      ) : (
        <p className="empty-bookshelf">
          No books match your current search or
          filters.
        </p>
      )}
    </div>
  );
}

export default Books;