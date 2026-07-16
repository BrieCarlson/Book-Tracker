import { useState } from "react";

function AddBook({ setBooks }) {

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const newBook = {
      id: Date.now(),
      title: title,
      author: author,
      coverImage: "",
      status: "Want to Read",
      rating: 0,
      summary: "",
      notes: "",
      dateStarted: "",
      dateFinished: ""
    };

    setBooks((currentBooks) => [
      ...currentBooks,
      newBook
    ]);

    setTitle("");
    setAuthor("");
  }

  return (
    <div>
      <h1>Add Book</h1>

      <form onSubmit={handleSubmit}>

        <input
          placeholder="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <input
          placeholder="Author"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
        />

        <button>
          Add Book
        </button>

      </form>
    </div>
  );
}

export default AddBook;