function getFileDate() {
  return new Date().toISOString().slice(0, 10);
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], {
    type: mimeType,
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function escapeCsvValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
}

function createCsv(books) {
  const columns = [
    "Title",
    "Author",
    "ISBN",
    "Genre",
    "Series",
    "Pages",
    "Publisher",
    "Publication Date",
    "Status",
    "Rating",
    "Date Started",
    "Date Finished",
    "Date Added",
    "Summary",
    "Notes",
    "Cover Image",
  ];

  const rows = books.map((book) => [
    book.title || "",
    book.author || "",
    book.isbn || "",
    book.genre || "",
    book.series || "",
    book.pages ?? "",
    book.publisher || "",
    book.publicationDate || "",
    book.status || "",
    book.rating ?? "",
    book.dateStarted || "",
    book.dateFinished || "",
    book.dateAdded || "",
    book.summary || "",
    book.notes || "",
    book.coverImage || "",
  ]);

  return [
    columns.map(escapeCsvValue).join(","),
    ...rows.map((row) =>
      row.map(escapeCsvValue).join(",")
    ),
  ].join("\r\n");
}

function createJson(books) {
  const exportBooks = books.map((book) => ({
    title: book.title || "",
    author: book.author || "",
    isbn: book.isbn || "",
    genre: book.genre || "",
    series: book.series || "",
    pages: book.pages ?? null,
    publisher: book.publisher || "",
    publicationDate:
      book.publicationDate || "",
    status: book.status || "",
    rating: book.rating ?? 0,
    dateStarted: book.dateStarted || "",
    dateFinished: book.dateFinished || "",
    dateAdded: book.dateAdded || "",
    summary: book.summary || "",
    notes: book.notes || "",
    coverImage: book.coverImage || "",
  }));

  return JSON.stringify(
    {
      format: "book-tracker-library",
      version: 1,
      exportedAt: new Date().toISOString(),
      books: exportBooks,
    },
    null,
    2
  );
}

function LibraryExport({ books = [] }) {
  function handleExportCsv() {
    const csv = createCsv(books);

    downloadFile(
      csv,
      `book-tracker-library-${getFileDate()}.csv`,
      "text/csv;charset=utf-8;"
    );
  }

  function handleExportJson() {
    const json = createJson(books);

    downloadFile(
      json,
      `book-tracker-library-${getFileDate()}.json`,
      "application/json;charset=utf-8;"
    );
  }

  return (
    <div className="library-export">
      <button
        type="button"
        onClick={handleExportCsv}
        disabled={books.length === 0}
      >
        Export CSV
      </button>

      <button
        type="button"
        onClick={handleExportJson}
        disabled={books.length === 0}
      >
        Export JSON
      </button>
    </div>
  );
}

export default LibraryExport;