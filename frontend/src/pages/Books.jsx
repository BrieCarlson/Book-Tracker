import BookCard from "../components/BookCard";

function Books({ books, setBooks, setEditingBook }) {
  return (
    <div>
      <h1>My Books</h1>

      {books.map((book) => (
        <BookCard 
          key={book.id} 
          book={book}
          setBooks={setBooks}
          setEditingBook={setEditingBook}
        />
      ))}
    </div>
  );
}

export default Books;