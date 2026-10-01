const API_URL =
  "https://book-tracker-0of6.onrender.com/api/books";

const AUTH_API_URL =
  "https://book-tracker-0of6.onrender.com/api/auth";

async function getCsrfToken() {
  const response = await fetch(
    `${AUTH_API_URL}/csrf`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.csrfToken) {
    throw new Error(
      data.message ||
        "Unable to get the security token. Please log in again."
    );
  }

  return data.csrfToken;
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
    if (response.status === 401) {
      throw new Error(
        data.message ||
          "Your session has expired. Please log in again."
      );
    }

    if (response.status === 403) {
      throw new Error(
        data.message ||
          "Security verification failed. Please refresh and try again."
      );
    }

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
    method: "GET",
    credentials: "include",
  });

  return parseResponse(response);
}

export async function createBook(book) {
  const csrfToken = await getCsrfToken();

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
  const csrfToken = await getCsrfToken();

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
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "X-CSRF-Token": csrfToken,
    },
  });

  return parseResponse(response);
}