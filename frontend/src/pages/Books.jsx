import BookCard from "../components/BookCard";

function Books({ books }) {
  return (
    <div>
      <h1>My Books</h1>

      {books.map((book) => (
        <BookCard 
          key={book.id} 
          book={book}
        />
      ))}
    </div>
  );
}

export default Books;