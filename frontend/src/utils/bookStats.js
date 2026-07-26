export function getFinishedBooks(books) {
  return books.filter(
    (book) => book.status === "Finished"
  );
}

export function getAverageRating(books) {
  const ratedBooks = books.filter(
    (book) => book.rating > 0
  );

  if (ratedBooks.length === 0) {
    return 0;
  }

  const total = ratedBooks.reduce(
    (sum, book) => sum + book.rating,
    0
  );

  return total / ratedBooks.length;
}