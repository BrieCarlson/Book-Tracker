const API_URL = "http://localhost:5000/api/books";

function getCsrfToken() {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [name, ...valueParts] = cookie.trim().split("=");

    if (name === "book_tracker_csrf") {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return "";
}

async function parseResponse(response) {
  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    if (response.status === 413) {
      throw new Error(
        "The book information is too large. Please shorten the summary, notes, or cover image URL."
      );
    }

    throw new Error(
      data.message ||
        `Request failed with status ${response.status}.`
    );
  }

  return data;
}

export async function getBooks() {
  const response = await fetch(API_URL, {
    credentials: "include",
  });

  return parseResponse(response);
}

export async function createBook(book) {
  const csrfToken = getCsrfToken();

  const response = await fetch(API_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify(book),
  });

  return parseResponse(response);
}

export async function updateBook(id, book) {
  const csrfToken = getCsrfToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify(book),
  });

  return parseResponse(response);
}

export async function deleteBook(id) {
  const csrfToken = getCsrfToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "X-CSRF-Token": csrfToken,
    },
  });

  return parseResponse(response);
}