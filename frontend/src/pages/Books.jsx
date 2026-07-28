import BookCard from "../components/BookCard";

function Books({ books }) {
  return (
    <div>
      <h1>My Books</h1>

      {books.length > 0 ? (
        books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
          />
        ))
      ) : (
        <p>No books added yet.</p>
      )}
    </div>
  );
}

export default Books;