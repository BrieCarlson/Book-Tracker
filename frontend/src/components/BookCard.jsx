function BookCard({ book }) {
  return (
    <div>
      <h2>{book.title}</h2>
      <p>{book.author}</p>
      <p>Status: {book.status}</p>
      <p>Rating: {book.rating}/5</p>
    </div>
  );
}

export default BookCard;