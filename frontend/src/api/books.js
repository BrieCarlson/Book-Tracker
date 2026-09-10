const API_URL = "http://localhost:5000/api/books";

function getAuthHeaders() {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
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
    headers: getAuthHeaders(),
  });

  return parseResponse(response);
}

export async function createBook(book) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(book),
  });

  return parseResponse(response);
}

export async function updateBook(id, book) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(book),
  });

  return parseResponse(response);
}

export async function deleteBook(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return parseResponse(response);
}