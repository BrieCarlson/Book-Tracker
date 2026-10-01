const API_URL = "https://book-tracker-0of6.onrender.com/api/book-search";

export async function searchBooks(query, signal) {
  const response = await fetch(
    `${API_URL}?q=${encodeURIComponent(query)}`,
    {
      signal,
      credentials: "include",
    }
  );

  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        `Book search failed with status ${response.status}.`
    );
  }

  return Array.isArray(data.results)
    ? data.results
    : [];
}
