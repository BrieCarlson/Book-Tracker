import BookForm from "../components/BookForm";

function EditBook({ editingBook, books, setBooks, setEditingBook }) {

  if (!editingBook) {
    return null;
  }

  function handleEditBook(updatedBook) {
    const updatedBooks = books.map((book) => {
      if (book.id === editingBook.id) {
        return {
          ...book,
          ...updatedBook,
        };
      }

      return book;
    });

    setBooks(updatedBooks);
    setEditingBook(null);
  }

  return (
    <div>
      <h1>Edit Book</h1>

      <BookForm
        book={editingBook}
        onSubmit={handleEditBook}
      />
    </div>
  );
}

export default EditBook;