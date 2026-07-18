import BookForm from "../components/BookForm";

function AddBook({ setBooks }) {
  function handleAddBook(book) {
    const newBook = {
      id: Date.now(),
        ...book,
    };

    setBooks((currentBooks) => [
      ...currentBooks,
      newBook
    ]);
  }

  return (
    <div>
      <h1>Add Book</h1>

      <BookForm onSubmit={handleAddBook} />
    </div>
  );
}

export default AddBook;