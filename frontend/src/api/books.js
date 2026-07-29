const API_URL = "http://localhost:5000/api/books";


// Get all books
export async function getBooks() {
  const response = await fetch(API_URL);

  return response.json();
}


// Add a book
export async function createBook(book) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  });

  return response.json();
}


// Update a book
export async function updateBook(id, book) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  });

  return response.json();
}


// Delete a book
export async function deleteBook(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  return response.json();
}