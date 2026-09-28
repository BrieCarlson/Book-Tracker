import { useState } from "react";
import {
  createBook,
  getBooks,
  updateBook,
} from "../api/books";

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function getIsbn(book) {
  return normalize(book.isbn).replace(/[-\s]/g, "");
}

function findDuplicate(importedBook, existingBooks) {
  const importedIsbn = getIsbn(importedBook);

  if (importedIsbn) {
    const isbnMatch = existingBooks.find(
      (existingBook) =>
        getIsbn(existingBook) === importedIsbn
    );

    if (isbnMatch) {
      return isbnMatch;
    }
  }

  const importedTitle = normalize(
    importedBook.title
  );
  const importedAuthor = normalize(
    importedBook.author
  );

  if (!importedTitle) {
    return null;
  }

  return (
    existingBooks.find((existingBook) => {
      const existingTitle = normalize(
        existingBook.title
      );
      const existingAuthor = normalize(
        existingBook.author
      );

      return (
        existingTitle === importedTitle &&
        existingAuthor === importedAuthor
      );
    }) || null
  );
}

function cleanImportedBook(book) {
  if (!book || typeof book !== "object") {
    return null;
  }

  const title = String(book.title || "").trim();
  const author = String(book.author || "").trim();

  if (!title && !author) {
    return null;
  }

  return {
    title: title || "Unknown Title",
    author: author || "Unknown Author",
    isbn: String(book.isbn || "").trim(),
    genre: String(book.genre || "").trim(),
    series: String(book.series || "").trim(),
    pages:
      Number.isFinite(Number(book.pages)) &&
      Number(book.pages) > 0
        ? Number(book.pages)
        : null,
    publisher: String(
      book.publisher || ""
    ).trim(),
    publicationDate: String(
      book.publicationDate || ""
    ).trim(),
    status:
      String(book.status || "").trim() ||
      "Want To Read",
    rating:
      Number.isFinite(Number(book.rating)) &&
      Number(book.rating) >= 0 &&
      Number(book.rating) <= 5
        ? Number(book.rating)
        : 0,
    dateStarted: String(
      book.dateStarted || ""
    ).trim(),
    dateFinished: String(
      book.dateFinished || ""
    ).trim(),
    summary: String(
      book.summary || ""
    ).trim(),
    notes: String(
      book.notes || ""
    ).trim(),
    coverImage: String(
      book.coverImage || ""
    ).trim(),
  };
}

function LibraryImport() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewBooks, setPreviewBooks] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [importing, setImporting] = useState(false);

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    setSelectedFile(file || null);
    setPreviewBooks([]);
    setError("");
    setMessage("");

    if (!file) {
      return;
    }

    if (
      !file.name
        .toLowerCase()
        .endsWith(".json")
    ) {
      setError(
        "Please select a JSON backup file."
      );
      return;
    }

    readJsonFile(file);
  }

  function readJsonFile(file) {
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const data = JSON.parse(
          reader.result
        );

        if (
          data.format !==
          "book-tracker-library"
        ) {
          setError(
            "This does not appear to be a Book Tracker library backup."
          );
          return;
        }

        if (!Array.isArray(data.books)) {
          setError(
            "This backup does not contain a valid book list."
          );
          return;
        }

        const cleanedBooks = data.books
          .map(cleanImportedBook)
          .filter(Boolean);

        if (cleanedBooks.length === 0) {
          setError(
            "The backup does not contain any valid books."
          );
          return;
        }

        const existingBooks =
          await getBooks();

        const booksWithDuplicates =
          cleanedBooks.map((book, index) => {
            const duplicate =
              findDuplicate(
                book,
                existingBooks
              );

            return {
              id: `${book.title}-${book.author}-${index}`,
              book,
              duplicate,
              action: duplicate
                ? "skip"
                : "add",
            };
          });

        setPreviewBooks(
          booksWithDuplicates
        );
      } catch (fileError) {
        if (
          fileError?.message
            ?.toLowerCase()
            .includes("book")
        ) {
          setError(fileError.message);
        } else {
          setError(
            "The selected file is not valid JSON."
          );
        }
      }
    };

    reader.onerror = () => {
      setError(
        "The file could not be read."
      );
    };

    reader.readAsText(file);
  }

  function setBookAction(id, action) {
    setPreviewBooks((currentBooks) =>
      currentBooks.map((item) =>
        item.id === id
          ? {
              ...item,
              action,
            }
          : item
      )
    );
  }

  async function handleImport() {
    const booksToProcess =
      previewBooks.filter(
        (item) => item.action !== "skip"
      );

    if (booksToProcess.length === 0) {
      setError(
        "Select at least one book to import."
      );
      return;
    }

    setImporting(true);
    setError("");
    setMessage("");

    let addedCount = 0;
    let overriddenCount = 0;
    let failedCount = 0;

    for (const item of booksToProcess) {
      try {
        if (
          item.action === "override" &&
          item.duplicate
        ) {
          await updateBook(
            item.duplicate._id,
            item.book
          );

          overriddenCount += 1;
        } else if (
          item.action === "duplicate"
        ) {
          await createBook(item.book);

          addedCount += 1;
        } else if (
          item.action === "add"
        ) {
          await createBook(item.book);

          addedCount += 1;
        }
      } catch {
        failedCount += 1;
      }
    }

    setImporting(false);

    const resultParts = [];

    if (addedCount > 0) {
      resultParts.push(
        `${addedCount} added`
      );
    }

    if (overriddenCount > 0) {
      resultParts.push(
        `${overriddenCount} overridden`
      );
    }

    if (failedCount > 0) {
      resultParts.push(
        `${failedCount} failed`
      );
    }

    setMessage(
      resultParts.length > 0
        ? `Import complete: ${resultParts.join(
            ", "
          )}.`
        : "No books were imported."
    );

    setPreviewBooks([]);
    setSelectedFile(null);
  }

  function handleCancel() {
    setSelectedFile(null);
    setPreviewBooks([]);
    setError("");
    setMessage("");
  }

  const duplicateCount =
    previewBooks.filter(
      (item) => item.duplicate
    ).length;

  const newCount =
    previewBooks.length -
    duplicateCount;

  return (
    <div className="library-import">
      <input
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
      />

      {selectedFile && (
        <p>
          Selected file:{" "}
          <strong>
            {selectedFile.name}
          </strong>
        </p>
      )}

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      {message && (
        <p className="form-success">
          {message}
        </p>
      )}

      {previewBooks.length > 0 && (
        <div className="library-import-preview">
          <h4>Import Preview</h4>

          <p>
            {previewBooks.length} book
            {previewBooks.length === 1
              ? ""
              : "s"} found.
          </p>

          <p>
            {newCount} new ·{" "}
            {duplicateCount} duplicate
            {duplicateCount === 1
              ? ""
              : "s"}
          </p>

          <div className="library-import-list">
            {previewBooks.map((item) => (
              <div
                className="library-import-book"
                key={item.id}
              >
                <div>
                  <strong>
                    {item.book.title}
                  </strong>{" "}
                  <span>
                    by {item.book.author}
                  </span>
                </div>

                {item.duplicate ? (
                  <div>
                    <p>
                      Already in your library:
                      {" "}
                      <strong>
                        {item.duplicate.title}
                      </strong>{" "}
                      by{" "}
                      {item.duplicate.author}
                    </p>

                    <select
                      value={item.action}
                      onChange={(event) =>
                        setBookAction(
                          item.id,
                          event.target.value
                        )
                      }
                      disabled={importing}
                    >
                      <option value="skip">
                        Skip
                      </option>

                      <option value="override">
                        Override existing
                      </option>

                      <option value="duplicate">
                        Add as duplicate
                      </option>
                    </select>
                  </div>
                ) : (
                  <p>
                    <strong>New book</strong>
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="library-import-actions">
            <button
              type="button"
              onClick={handleImport}
              disabled={importing}
            >
              {importing
                ? "Importing..."
                : "Import Selected"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={importing}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LibraryImport;
