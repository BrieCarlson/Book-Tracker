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
        publishedDate: firstString(
            document.publish_date
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
            "publish_date",
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

        const data = await response.json().catch(() => null);

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
        console.error("Book search error:", error.message);

        res.status(502).json({
            message:
                "The book search service is temporarily unavailable.",
        });
    }
};
