const OPEN_LIBRARY_SEARCH_URL =
  "https://openlibrary.org/search.json";

function firstString(value) {
  if (Array.isArray(value)) {
    return (
      value.find(
        (item) =>
          typeof item === "string" &&
          item.trim()
      ) || ""
    );
  }

  return typeof value === "string" ? value : "";
}

function chooseIsbn(isbns) {
  if (!Array.isArray(isbns)) {
    return "";
  }

  const isbn13 = isbns.find((isbn) => {
    const normalized = String(isbn).replaceAll(
      "-",
      ""
    );

    return normalized.length === 13;
  });

  return isbn13 || isbns[0] || "";
}

function chooseGenres(subjects) {
  if (!Array.isArray(subjects)) {
    return "";
  }

  const genres = subjects
    .filter(
      (subject) =>
        typeof subject === "string" &&
        subject.trim()
    )
    .map((subject) => subject.trim())
    .filter(
      (subject) =>
        !subject.toLowerCase().includes("fiction") ||
        subject.toLowerCase() === "fiction"
    );

  return [...new Set(genres)].slice(0, 5).join(", ");
}

function choosePublisher(publishers) {
  if (!Array.isArray(publishers)) {
    return "";
  }

  return (
    publishers.find(
      (publisher) =>
        typeof publisher === "string" &&
        publisher.trim()
    ) || ""
  );
}

function chooseSeries(series) {
  if (!Array.isArray(series)) {
    return "";
  }

  return (
    series.find(
      (item) =>
        typeof item === "string" &&
        item.trim()
    ) || ""
  );
}

function choosePages(document) {
  if (
    typeof document.number_of_pages_median ===
      "number" &&
    document.number_of_pages_median > 0
  ) {
    return document.number_of_pages_median;
  }

  if (
    Array.isArray(document.number_of_pages) &&
    document.number_of_pages.length > 0
  ) {
    const pages = document.number_of_pages.find(
      (value) =>
        typeof value === "number" && value > 0
    );

    return pages || null;
  }

  return null;
}

function normalizeBook(document) {
  const title =
    firstString(document.title) || "Unknown Title";

  const author =
    Array.isArray(document.author_name) &&
    document.author_name.length > 0
      ? document.author_name.join(", ")
      : "Unknown Author";

  const coverImage = document.cover_i
    ? `https://covers.openlibrary.org/b/id/${document.cover_i}-M.jpg?default=false`
    : "";

  return {
    externalId: document.key || "",
    title,
    author,
    isbn: chooseIsbn(document.isbn),
    coverImage,
    genre: chooseGenres(document.subject),
    series: chooseSeries(document.series),
    pages: choosePages(document),
    publisher: choosePublisher(document.publisher),
    publicationDate: firstString(
      document.first_publish_year
    ),
  };
}

exports.searchBooks = async (req, res) => {
  const requestedQuery = req.query.q;

  if (typeof requestedQuery !== "string") {
    return res.status(400).json({
      message: "A search query is required.",
    });
  }

  const query = requestedQuery.trim();

  if (query.length < 2) {
    return res.status(400).json({
      message:
        "Search must contain at least 2 characters.",
    });
  }

  if (query.length > 100) {
    return res.status(400).json({
      message:
        "Search must be 100 characters or fewer.",
    });
  }

  const searchUrl = new URL(
    OPEN_LIBRARY_SEARCH_URL
  );

  searchUrl.searchParams.set("q", query);
  searchUrl.searchParams.set("limit", "8");

  searchUrl.searchParams.set(
    "fields",
    [
      "key",
      "title",
      "author_name",
      "cover_i",
      "isbn",
      "subject",
      "series",
      "number_of_pages",
      "number_of_pages_median",
      "publisher",
      "first_publish_year",
    ].join(",")
  );

  try {
    const contact =
      process.env.OPEN_LIBRARY_CONTACT ||
      "local-development";

    const response = await fetch(searchUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": `Book Tracker/1.0 (${contact})`,
      },
      signal: AbortSignal.timeout(8000),
    });

    const data = await response
      .json()
      .catch(() => null);

    if (!response.ok || !data) {
      return res.status(502).json({
        message:
          "The book search service is temporarily unavailable.",
      });
    }

    const results = Array.isArray(data.docs)
      ? data.docs.map(normalizeBook)
      : [];

    res.json({ results });
  } catch (error) {
    console.error(
      "Book search error:",
      error.message
    );

    res.status(502).json({
      message:
        "The book search service is temporarily unavailable.",
    });
  }
};